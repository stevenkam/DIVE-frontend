import {
  REQUEST_DATASET,
  RECEIVE_DATASET,
  REQUEST_DATASETS,
  RECEIVE_DATASETS,
  REQUEST_UPLOAD_DATASET,
  RECEIVE_UPLOAD_DATASET
} from '../constants/ActionTypes';

import fetch from './api.js';

function requestDatasetsDispatcher() {
  return {
    type: REQUEST_DATASETS
  };
}

function receiveDatasetsDispatcher(projectId, json) {
  return {
    type: RECEIVE_DATASETS,
    projectId: projectId,
    datasets: json.datasets,
    receivedAt: Date.now()
  };
}

function fetchDatasets(projectId) {
  return dispatch => {
    dispatch(requestDatasetsDispatcher());
    return fetch('/datasets?pID=' + projectId)
      .then(response => response.json())
      .then(json => dispatch(receiveDatasetsDispatcher(projectId, json)));
  };
}

function shouldFetchDatasets(state) {
  const datasets = state.datasets;
  if (datasets.items.length > 0 || datasets.isFetching) {
    return false;
  }
  return true;
}

export function fetchDatasetsIfNeeded(projectId) {
  return (dispatch, getState) => {
    if (shouldFetchDatasets(getState())) {
      return dispatch(fetchDatasets(projectId));
    }
  };
}

function requestUploadDatasetDispatcher() {
  return {
    type: REQUEST_UPLOAD_DATASET
  };
}

function receiveUploadDatasetDispatcher(json) {
  return {
    type: RECEIVE_UPLOAD_DATASET,
    dataset: json.datasets[0]
  };
}

export function uploadDataset(projectId, datasetFile) {
  var formData = new FormData();
  formData.append('data', JSON.stringify({ pID: projectId }));
  formData.append('file', datasetFile);

  return (dispatch) => {
    dispatch(requestUploadDatasetDispatcher());
    return fetch('/upload', {
      method: 'post',
      body: formData
    }).then(response => response.json())
      .then(json => dispatch(receiveUploadDatasetDispatcher(json)));
  };
}

function requestDatasetDispatcher(datasetId) {
  return {
    type: REQUEST_DATASET,
    datasetId: datasetId
  };
}

function receiveDatasetDispatcher(json) {
  return {
    type: RECEIVE_DATASET,
    datasetId: json.dID,
    title: json.title,
    details: json.details
  };
}

export function fetchDataset(projectId, datasetId) {
  return (dispatch) => {
    dispatch(requestDatasetDispatcher(datasetId));
    return fetch(`/datasets/${datasetId}?pID=${projectId}`)
      .then(response => response.json())
      .then(json => dispatch(receiveDatasetDispatcher(json)));
  };
}


