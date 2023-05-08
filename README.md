# DAU-Management-App

The app aims at helping researchers conducting research on the quantum annealing algorithm with the digitial annealer unit provided by the Fujitsu company. The app enables users to post their solving time of each job spontaneously and the data will be consistent with the data from the Fujitsu company by querying its API `/da/v3/async/jobs`. The app also do visualizes users' usage and allow user to delete alive jobs which are on the Fujitsu server.

## API

### /api/posts/

Post/Update the `solve_time` of a job to the server.

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
    "solve_time" : [solve time acquired from the result of solution]
}
```

#### For example

**Python**

```python=
post_to_dma_data = {
    "api_key" : "apikey5566",
    "job_id" : job_id,
    "solve_time" : solution.json()['qubo_solution']['timing']['solve_time']
}
dau_management_app_header = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}
post_to_dma = requests.post("http://localhost:3001/api/posts/", headers=dau_management_app_header, data=json.dumps(post_to_dma_data))
```
