import { createSlice } from "@reduxjs/toolkit";
import api from "../../utils/axiosConfig";

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    loading: false,
    error: null,
    message: null,
    singleJob: {},
    myJobs: [],
  },
  reducers: {
    requestForAllJobs(state, action) {
      state.loading = true;
      state.error = null;
    },
    successForAllJobs(state, action) {
      state.loading = false;
      state.jobs = action.payload;
      state.error = null;
    },
    failureForAllJobs(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    requestForSingleJob(state, action) {
      state.message = null;
      state.error = null;
      state.loading = true;
    },
    successForSingleJob(state, action) {
      state.loading = false;
      state.error = null;
      state.singleJob = action.payload;
    },
    failureForSingleJob(state, action) {
      state.singleJob = state.singleJob;
      state.error = action.payload;
      state.loading = false;
    },
    requestForPostJob(state, action) {
      state.message = null;
      state.error = null;
      state.loading = true;
    },
    successForPostJob(state, action) {
      state.message = action.payload;
      state.error = null;
      state.loading = false;
    },
    failureForPostJob(state, action) {
      state.message = null;
      state.error = action.payload;
      state.loading = false;
    },

    requestForDeleteJob(state, action) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForDeleteJob(state, action) {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    failureForDeleteJob(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    requestForMyJobs(state, action) {
      state.loading = true;
      state.myJobs = [];
      state.error = null;
    },
    successForMyJobs(state, action) {
      state.loading = false;
      state.myJobs = action.payload;
      state.error = null;
    },
    failureForMyJobs(state, action) {
      state.loading = false;
      state.myJobs = state.myJobs;
      state.error = action.payload;
    },

    clearAllErrors(state, action) {
      state.error = null;
      state.jobs = state.jobs;
    },
    resetJobSlice(state, action) {
      state.error = null;
      state.jobs = state.jobs;
      state.loading = false;
      state.message = null;
      state.myJobs = state.myJobs;
      state.singleJob = {};
    },
  },
});

export const fetchJobs =
  (city, niche, searchKeyword = "") =>
  async (dispatch) => {
    try {
      dispatch(jobSlice.actions.requestForAllJobs());
      let link = "/api/v1/job/getall?";
      let queryParams = [];
      if (searchKeyword) {
        queryParams.push(`searchKeyword=${searchKeyword}`);
      }
      if (city) {
        queryParams.push(`city=${city}`);
      }
      if (niche) {
        queryParams.push(`niche=${niche}`);
      }

      link += queryParams.join("&");
      const response = await api.get(link);
      dispatch(jobSlice.actions.successForAllJobs(response.data.jobs));
      dispatch(jobSlice.actions.clearAllErrors());
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch jobs. Please check if the server is running.";
      dispatch(jobSlice.actions.failureForAllJobs(errorMessage));
    }
  };

export const fetchSingleJob = (jobId) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForSingleJob());
  try {
    const response = await api.get(
      `/api/v1/job/get/${jobId}`
    );
    dispatch(jobSlice.actions.successForSingleJob(response.data.job));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch job details. Please check if the server is running.";
    dispatch(jobSlice.actions.failureForSingleJob(errorMessage));
  }
};

export const postJob = (data) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForPostJob());
  try {
    const response = await api.post(
      "/api/v1/job/post",
      data,
      { headers: { "Content-Type": "application/json" } }
    );
    dispatch(jobSlice.actions.successForPostJob(response.data.message));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to post job. Please check if the server is running.";
    dispatch(jobSlice.actions.failureForPostJob(errorMessage));
  }
};

export const getMyJobs = () => async (dispatch) => {
  dispatch(jobSlice.actions.requestForMyJobs());
  try {
    const response = await api.get(
      "/api/v1/job/getmyjobs"
    );
    dispatch(jobSlice.actions.successForMyJobs(response.data.myJobs));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch your jobs. Please check if the server is running.";
    dispatch(jobSlice.actions.failureForMyJobs(errorMessage));
  }
};

export const deleteJob = (id) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForDeleteJob());
  try {
    const response = await api.delete(
      `/api/v1/job/delete/${id}`
    );
    dispatch(jobSlice.actions.successForDeleteJob(response.data.message));
    dispatch(clearAllJobErrors());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to delete job. Please check if the server is running.";
    dispatch(jobSlice.actions.failureForDeleteJob(errorMessage));
  }
};

export const clearAllJobErrors = () => (dispatch) => {
  dispatch(jobSlice.actions.clearAllErrors());
};

export const resetJobSlice = () => (dispatch) => {
  dispatch(jobSlice.actions.resetJobSlice());
};

export default jobSlice.reducer;
