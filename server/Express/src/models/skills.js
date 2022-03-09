const mongoose = require('mongoose');

const SkillsSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, 'Please fill the skill'],
        trim: true,
        minlength: [3, 'Skill length less than 3'],
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'BaseUser',
    },
});

const Skill = mongoose.model('Skill', SkillsSchema);
module.exports = Skill;