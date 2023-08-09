import Task from "../models/Task.js";
export const createtask = async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
      user:req.user.id,
      description:req.body.description,
      completed: req.body.completed,
    });
    const savedtask = await newTask.save();
    return res.status(201).json(savedtask);
  } catch (error) {
    return res.json(error);  }
};

export const getalltask = async (req, res) => {
  try {
    const tasks = await Task.aggregate([
      {
        "$lookup":{
      
        "from": "userdatas",
        "localField": "user",
        "foreignField": "_id",
        "as": "result"
      }
    }]);
    return res.status(200).json(tasks);
  } catch (error) {
    return res.json(error);
  }
};

export const getcurrentusertask = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
  
    return res.status(200).json(tasks);
  } catch (error) {
    return res.json(error);
  }
};

export const searchTasksBetweenDates = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const tasks = await Task.find({
      user: req.user.id,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

   

    return res.status(200).json(tasks);
  } catch (error) {
    return res.json(error);
  }
};


export const updatetask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskid).exec();
    if (!task) {
      return res.json("no task found");
    }
    if (task.user.toString() !== req.user.id) {
      return res.json("its not your task");
    }
    const updatedtask = await Task.findByIdAndUpdate(
      req.params.taskid,
      {
        title: req.body.title,
        completed: req.body.completed,
      },
      { new: true }
    );
    return res.status(200).json(updatedtask);
  } catch (error) {
    return res.json(error);
  }
};

export const deletetask=async(req,res)=>{
    try{
        const task = await Task.findById(req.params.taskid).exec();
        if (!task) {
          return res.json("no task found");
        }
        if (task.user.toString() !== req.user.id) {
          return res.json("its not your task");
        }
        await Task.findByIdAndDelete(req.params.taskid);
        return res.status(200).json("task deleted successfully")
    }
    catch(error){
return res.json(error); 
    }

}
