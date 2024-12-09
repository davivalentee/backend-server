import { FastifyInstance, FastifyRequest } from "fastify";
import { db } from '../lib/prisma'

export async function barbers(app: FastifyInstance) {

  type MyRequestGet = FastifyRequest<{
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
      shift?: string
    }
  }>

  type MyRequestPost = FastifyRequest<{
    Body: {
      name: string
      cpf: string
      email: string
      shift: string
      userId: string
    }
  }>

  app.post('/create-barber', async (request: MyRequestPost) => {

    const { name, cpf, email, shift, userId } = request.body

    if (!name) {
      return new Error('name is required')
    }

    if (!cpf) {
      return new Error('cpf is required')
    }

    if (!email) {
      return new Error('email is required')
    }

    if (!shift) {
      return new Error('shift is required')
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

    const barber = await db.barber.create({
      data: {
        name: name,
        cpf: cpf,
        email: email,
        shift: shift,
        userId: userId
      }
    })
    return barber
  })

  app.get('/get-barbers-by-user', async (request: MyRequestGet) => {

    let userId = request.query.userId;

    if (!userId) {
      return new Error('userId is required')
    }

    const barbers = await db.barber.findMany({
      where: {
        userId: userId
      }
    })
    return barbers
  })
  
  app.delete('/delete-barber', async (request: MyRequestDelete) => {

    const userId = request.query.userId;
    const id = request.query.id;

    const barber = await db.barber.findUnique({
      where: {
        id
      }
    })

    const user = await db.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!barber) {
      return new Error('barber not found')
    }

    if (!user) {
      return new Error('user not found')
    }

    await db.barber.delete({
      where: {
        id,
        userId
      }
    })

  })

  app.put('/update-barber', async (request: MyRequestPut) => {

    const userId = request.query.userId;
    const id = request.query.id;

    const { name, cpf, email, shift } = request.body

    const barber = await db.barber.findUnique({
      where: {
        id
      }
    })

    const user = await db.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!barber) {
      return new Error('barber not found')
    }

    if (!user) {
      return new Error('user not found')
    }

    const updatedBarber = await db.barber.update({
      where: {
        id,
        userId
      },
      data: {
        name: name || barber.name,
        cpf: cpf || barber.cpf,
        email: email || barber.email,
        shift: shift || barber.shift
      }
    })

    return updatedBarber

  })

  

}
