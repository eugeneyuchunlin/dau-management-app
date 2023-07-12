## Introduction

This web application aims to monitor real-time usage of the digital annealing unit. The DAU computation service is provided by the Fujitsu Ltd.

The available APIs from Fujitsu have limitations, making it difficult for users to track their usage of the computation service. The DAU-Management-App allows users to register their job_id by providing their api_key to the application. The app is designed to offer statistical analysis and data visualization, allowing users to gain insights into their usage patterns.

Additionally, the app could be seen as a tiny user interface of Fujitsu's API. It enables user to delete finished job and cancel the waiting jobs. 

## API

### /api/posts

Register your `job_id` with your `username` by indicating the your `api_key`

**header**
```
{
    "Content-Type": "application/json",
    "Accept": "application/json",
}
```

**body**

```
{
    "api_key" : <your api key of dau-management-app>,
    "job_id" : <your job_id>,
    "time_limit_sec" : <the time limit you post to the Fujitsu server>
}
```

## Examples

### Python

```python=
response = requests.post(
    url + "/da/v3/async/qubo/solve",
    headers=problem_header,
    data=json.dumps(problem_body)
)


job_id = response.json()['job_id']
post_to_dma_data = {
    "api_key" : <my dma api key>,
    "job_id" : job_id,
    "time_limit_sec" : time_limit_sec,
}
dau_management_app_header = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}
post_to_dma = requests.post(
    "https://dau.emath.tw/api/posts",
    headers=dau_management_app_header,
    data=json.dumps(post_to_dma_data)
)
```

## curl

```shell=
curl -d '{
    "api_key": "<your dma api key>",
    "job_id": "0f03efef-ac2a-4eb4-a69c-03997d20cbb9-231930244783281",
    "time_limit_sec": 60
}' -H "Content-Type: application/json" -X POST https://dau.emath.tw/api/posts
```