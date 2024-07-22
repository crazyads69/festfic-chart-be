"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const get_story_1 = __importDefault(require("./routes/get-story"));
const dotenv_1 = __importDefault(require("dotenv"));
const get_story_round_two_1 = __importDefault(require("./routes/get-story-round-two"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use(express_1.default.json()); // Add this line to enable JSON parsing in the request body
// Add the router to the app
app.use("/api", get_story_1.default);
app.use("/api", get_story_round_two_1.default);
app.get("/", (req, res) => {
    // Send a JSON response with a message
    res.json({ message: "Hello, World!" });
});
// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map