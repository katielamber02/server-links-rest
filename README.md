curl -d {\"key\":\"value\"} -H "Content-Type: application/json" -X POST http://localhost:8000/api/register

{"data":{"key":"value"}}

To generate username lib could be used:

```
const username = shortId.generate();
```
