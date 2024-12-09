import fastify from "fastify";
import cors from '@fastify/cors'
import { barbers } from "./routes/barber";
import { customers } from "./routes/customer";
import { services } from "./routes/services";
import { users } from "./routes/user";

const app = fastify()

app.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
})

app.register(barbers)
app.register(customers)
app.register(services)
app.register(users)

app.listen({ port: 8080 }, () => console.log('Server is running on port 8080'))