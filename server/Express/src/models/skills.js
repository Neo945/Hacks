/* eslint-disable no-await-in-loop */
const mongoose = require('mongoose');

const SkillsSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, 'Please fill the skill'],
        trim: true,
        minlength: [3, 'Skill length less than 3'],
    },
});

SkillsSchema.statics.getSkills = async function (skills, user) {
    for (let i = 0; i < skills.length; i += 1) {
        const skill = await this.findOne({
            skill: skills[i],
        });
        if (!skill) {
            const newSkill = new this({
                skill,
            });
            await newSkill.save();
            user.skills.push(newSkill);
            await user.save();
        }
    }
};

const Skill = mongoose.model('Skill', SkillsSchema);
module.exports = Skill;