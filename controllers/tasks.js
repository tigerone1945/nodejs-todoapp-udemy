const Task = require('../models/Tasks');

const getAllTasks = async (req, res) => {
    try {
        const allTasks = await Task.find({});
        res.status(200).json({ allTasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTask = async (req, res) => {
    try {
        console.log('受信したデータ:', req.body);
        const task = await Task.create(req.body);
        console.log('作成されたタスク:', task);
        res.status(201).json({ task });
    } catch (error) {
        console.error('タスク作成エラー:', error);
        console.error('エラーの詳細:', error.message);
        res.status(500).json({ message: error.message });
    }
};

const getSingleTask = async (req, res) => {
    try {
        const getSingleTasktask = await Task.findOne({ _id: req.params.id });

        if (!getSingleTasktask) {
            return res.status(404).json({ message: `ID: ${req.params.id} のタスクが見つかりません` });
        }

        res.status(200).json({ task: getSingleTasktask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const updateTask = await Task.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        });

        if (!updateTask) {
            return res.status(404).json({ message: `ID: ${req.params.id} のタスクが見つかりません` });
        }

        res.status(200).json({ task: updateTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id: taskID } = req.params;
        const deleteTask = await Task.findOneAndDelete({ _id: req.params.id });

        if (!deleteTask) {
            return res.status(404).json({ message: `ID: ${req.params.id} のタスクが見つかりません` });
        }

        res.status(200).json({ task: deleteTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllTasks,
    createTask,
    getSingleTask,
    updateTask,
    deleteTask
};