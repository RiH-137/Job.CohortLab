import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";

export const postJob = catchAsyncErrors(async (req, res, next) => {

    // getting the details of the job from the request body
  const {
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsiteTitle,
    personalWebsiteUrl,
    jobNiche,
  } = req.body;

  if (
    !title ||
    !jobType ||
    !location ||
    !companyName ||
    !introduction ||
    !responsibilities ||
    !qualifications ||
    !salary ||
    !jobNiche
  ) {
    return next(new ErrorHandler("Please provide complete details.", 400));
  }
  if (
    (personalWebsiteTitle && !personalWebsiteUrl) ||
    (!personalWebsiteTitle && personalWebsiteUrl)
  ) {
    return next(
      new ErrorHandler(
        "Provide both the website url and title, or leave both blank.",
        400
      )
    );
  }
  const postedBy = req.user._id;
  const job = await Job.create({
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsite: {
      title: personalWebsiteTitle,
      url: personalWebsiteUrl,
    },
    jobNiche,
    postedBy,
  });
  res.status(201).json({
    success: true,
    message: "Job posted successfully.",
    job,
  });
});



//http://localhost:5173/(id)ginifnui?(query)kju6ijnu4in

// getting all the jobs that are posted by the employer
export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
    console.log("GetAll Bro")
  const { city, niche, searchKeyword } = req.query;

  const query = {};
  if (city) {
    query.location = city;
  }
  if (niche) {
    query.jobNiche = niche;
  }

  // search through the ...
  if (searchKeyword) {
    query.$or = [
      { title: { $regex: searchKeyword, $options: "i" } },
      { companyName: { $regex: searchKeyword, $options: "i" } },
      { introduction: { $regex: searchKeyword, $options: "i" } },
    ];
  }
  const jobs = await Job.find(query);
  res.status(200).json({
    success: true,
    jobs,
    count: jobs.length,
  });
});




// getting the jobs that are posted by the employer
export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
    console.log("Get My Bro")
  const myJobs = await Job.find({ postedBy: req.user._id });
  res.status(200).json({
    success: true,
    myJobs,
  });
});

// delete the job using params and deleteOne() method
export const deleteJob = catchAsyncErrors(async (req, res, next) => {
    console.log("Delete Bro")
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Oops! Job not found.", 404));
  }

  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job deleted.",
  });
});



// get a single job using the id
export const getASingleJob = catchAsyncErrors(async (req, res, next) => {
    console.log("Single Bro")
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }
  res.status(200).json({
    success: true,
    job,
  });
});
