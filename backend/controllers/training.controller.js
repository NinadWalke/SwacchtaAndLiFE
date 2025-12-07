const User = require('../schemas/User');

module.exports.recordQuizPoints = async (req, res) => {
    try {
        const { userId, points } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log(user.greencoins);
        await user.save();
        res.status(200).json({ message: "Quiz points recorded successfully", quizPoints: user.greencoins });
    } catch (error) {
        console.error("Error recording quiz points:", error);
        res.status(500).json({ message: "Internal server error" });
    }  
}