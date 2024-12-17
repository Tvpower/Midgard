import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    chaptersProgress: [{
        chapterIndex: Number,
        subsectionIndex: Number,
        completed: Boolean,
        completedAt: Date
    }],
    activities: [{
        type: {
            type: String,
            enum: ['phishingSimulation', 'passwordTester', 'quiz', 'chapterProgress'],
            required: true
        },
        chapterData: {
            chapterIndex: Number,
            subsectionIndex: Number,
            completed: Boolean,
            completedAt: Date
        },
        score: Number,
        completed: Boolean,
        completedAt: Date
    }],
    overallProgress: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

userProgressSchema.methods.calculateProgress = function() {
    // Initialize arrays if they don't exist
    this.chaptersProgress = this.chaptersProgress || [];
    this.activities = this.activities || [];

    const totalChapters = 7; // Total number of chapters in textbook
    const totalActivities = 2; // Total number of activities

    // Count completed chapters (including subsections)
    const completedChapters = new Set(
        this.activities
            .filter(a => a.type === 'chapterProgress' && a.chapterData?.completed)
            .map(a => a.chapterData.chapterIndex)
    ).size;

    // Count completed activities
    const completedActivities = this.activities.filter(
        a => a.type !== 'chapterProgress' && a.completed
    ).length;

    const totalItems = totalChapters + totalActivities;
    const completedItems = completedChapters + completedActivities;

    this.overallProgress = Math.round((completedItems / totalItems) * 100);
    return this.overallProgress;
};

const UserProgress = mongoose.model('UserProgress', userProgressSchema);
export default UserProgress;