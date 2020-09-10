curl -d {\"key\":\"value\"} -H "Content-Type: application/json" -X POST http://localhost:8000/api/register

{"data":{"key":"value"}}

To generate username lib could be used:

```
const username = shortId.generate();
```

https://placeholder.com/

```
const token = jwt.sign({ _id: user._id }

can use: req.user._id

exports.requireAuth = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});
```
