import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();


const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        // Requests without an Origin (curl, k6, service-to-service) are allowed.
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true
}));


app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static("public"));
app.use(cookieParser())

//import routes
import userRouter from './routes/user.routes.js' //you can rename the imported data if its exported as default
import subscriptionRouter from './routes/subscription.routes.js'
import videoRouter from "./routes/video.routes.js"
import likeRouter from "./routes/like.routes.js"
//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/like", likeRouter)
// Liveness endpoint used by load balancers and benchmark scripts. It deliberately
// avoids a database query so it measures the HTTP tier rather than MongoDB.
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        instance: process.env.INSTANCE_ID || 'local',
        uptimeSeconds: Math.round(process.uptime()),
        timestamp: new Date().toISOString()
    });
});

app.get("/", (req, res) => {
    res.send(JSON.stringify({ omar: "hello", police: "yeah" }))
})
app.use((err, req, res, next) => {
    console.error("ERROR:", err);

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal server error",
    });
});

export { app }