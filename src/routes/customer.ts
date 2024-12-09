import { FastifyInstance, FastifyRequest } from "fastify";
import { db } from '../lib/prisma'

export async function customers(app: FastifyInstance) {

  type MyRequest = FastifyRequest<{
    Querystring: {
      userId: string
    }
  }>

  type MyRequestDelete = FastifyRequest<{
    Querystring: {
      userId: string
      id: string
    }
  }>

  type MyRequestPut = FastifyRequest<{
    Querystring: {
      userId: string
      id: string
    }
    Body: {
      name?: string
      cpf?: string
      email?: string
      phone?: string
    }
  }>

  type MyRequestPost = FastifyRequest<{
    Body: {
      name: string
      cpf: string
      email: string
      phone: string
      userId: string
    }
  }>

  app.post('/create-customer', async (request: MyRequestPost) => {

    const { name, cpf, email, phone, userId } = request.body

    if (!name) {
      return new Error('name is required')
    }

    if (!cpf) {
      return new Error('cpf is required')
    }

    if (!email) {
      return new Error('email is required')
    }

    if (!phone) {
      return new Error('phone is required')
    }

    if (!userId) {
      return new Error('userId is required')
    }

    const user = await db.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) {
      return new Error('user not found')
    }

    const customer = await db.customer.create({
      data: {
        name: name,
        cpf: cpf,
        email: email,
        phone: phone,
        userId: userId
      }
    })
    return customer
  })

  app.get('/get-customers-by-user', async (request: MyRequest) => {

    let userId = request.query.userId;

    if (!userId) {
      return new Error('userId is required')
    }

    const customers = await db.customer.findMany({
      where: {
        userId: userId
      }
    })
    return customers
  })

  app.delete('/delete-customer', async (request: MyRequestDelete) => {

    const userId = request.query.userId;
    const id = request.query.id;

    const customer = await db.customer.findUnique({
      where: {
        id
      }
    })

    const user = await db.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!customer) {
      return new Error('customer not found')
    }

    if (!user) {
      return new Error('user not found')
    }

    await db.customer.delete({
      where: {
        id,
        userId
      }
    })

  })

  app.put('/update-customer', async (request: MyRequestPut) => {

    const userId = request.query.userId;
    const id = request.query.id;

    const { name, cpf, email, phone } = request.body

    const customer = await db.customer.findUnique({
      where: {
        id
      }
    })

    const user = await db.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!customer) {
      return new Error('customer not found')
    }

    if (!user) {
      return new Error('user not found')
    }

    const updatedCustomer = await db.customer.update({
      where: {
        id,
        userId
      },
      data: {
        name: name || customer.name,
        cpf: cpf || customer.cpf,
        email: email || customer.email,
        phone: phone || customer.phone
      }
    })

    return updatedCustomer

  })

}