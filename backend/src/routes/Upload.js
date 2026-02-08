import multer from "multer"
import { parse } from "csv-parse"
import { prisma } from "../db.js"
import { setBatchemails } from "../redis.js";
import { addBatchtoQueu } from "../queue.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 10 }, //10mb
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(csv)$/i)) {
            return cb(new Error("Only csv files are allowed"));
        }
        cb(null, true);
    },
})

function parseCsv(buffer) {
    return new Promise((resolve, reject) => {
        const emails = [];
        const parser = parse({
            columns: false,
            trim: true,
            skip_empty_lines: true,
            relax_column_count: true,
        });
        
        parser.on("data", (row) => {
            const email = (row[0] || "").trim();
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                emails.push(email);
            }
        });
        
        parser.on("error", reject);
        parser.on("end", () => resolve(emails));
        
        parser.write(buffer);
        parser.end();
    });
}

export function registerUploadroutes(app) {
    app.post("/api/upload", upload.single("file"), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    error: "No file uploaded"
                })
            }
            
            const emails = await parseCsv(req.file.buffer)
            
            if (emails.length === 0) {
                return res.status(400).json({
                    error: "No valid emails found in CSV. CSV should have one email per line (or one column).",
                });
            }

            const batch = await prisma.batch.create({
                data: {
                    filename: req.file.originalname,
                    totalEmails: emails.length,
                    status: "pending"
                }
            })
            //1 set Batch emails
            await setBatchemails(batch.id,emails)
            //2 add Batch to queue
            await addBatchtoQueu(batch.id)
            //3 publish batch status 
            

        } catch (error) {
            console.error("Upload error:", error)
            res.status(500).json({
                error: "Failed to process upload"
            })
        }
    })
}