# DAU-Management-App

The app aims at facilitating the researchers in the National Cheng Kung University to develop algorithms to solve real-world problems with the digital annealer unit provided by **Fujitsu Limited**

The APIs provided by the Fujitsu company are limited and their users can't perceive the usage of the computation service. The DAU-Management-App allows user to register their `job_id` by providing their `api_key` to the app. The application is designed to provide statistical analysis and data visualization, enabling users to gain insights into their usage patterns.

Additionally, the app could be seen as a tiny user interface of Fujitsu's API. It enables user to delete the job. The upcoming feature will be the function of `/v3/async/jobs/cancel`.

## API

### /api/posts/

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
    "api_key" : [your api key of dau-management-app],
    "job_id" : [your job_id],
    "time_limit_sec" : [the time limit you post to the Fujitsu server]
}
```

#### For example: Python

```python=
response = requests.post(
    url + "/da/v3/async/qubo/solve",
    headers=problem_header,
    data=json.dumps(problem_body)
)


job_id = response.json()['job_id']
post_to_dma_data = {
    "api_key" : "apikey5566",
    "job_id" : job_id,
    "time_limit_sec" : time_limit_sec,
}
dau_management_app_header = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}
post_to_dma = requests.post(
    "http://localhost:3000/api/posts/",
    headers=dau_management_app_header,
    data=json.dumps(post_to_dma_data)
)
```