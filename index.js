const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()

app.use(express.json())

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ message: `Order not found` })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const checkMethod = (request, response, next) => {
    const methodRequest = request.method
    const url = request.url

    console.log(`[${methodRequest}] ${url}`)
    next()
}

app.get('/orders', checkMethod, (request, response) => {
    return response.json(orders)
})

app.post('/orders', checkMethod, (request, response) => {
    const { clientOrder, clientName, price } = request.body
    const status = `Em preparação`
    const order = { id: uuid.v4(), clientOrder, clientName, price, status }

    orders.push(order)
    return response.status(201).json(order)
})

app.put('/orders/:id', checkOrderId, checkMethod, (request, response) => {
    const { clientOrder, clientName, price } = request.body
    const id = request.orderId
    const index = request.orderIndex 
    const status = `Em preparação`
    
    const changedOrder = { id, clientOrder, clientName, price, status }

    orders[index] = changedOrder

    return response.json(changedOrder)
})

app.delete('/orders/:id', checkOrderId, checkMethod, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.get('/orders/:id', checkOrderId, checkMethod, (request, response) => {
    const index = request.orderIndex
 
    return response.json(orders[index])
})

app.patch('/orders/:id', checkOrderId, checkMethod, (request, response) => {
    const index = request.orderIndex
    const id = request.orderId
    const { order, clientName, price } = orders[index]
    const finisheOrder = { id, order, clientName, price, status: "Pronto" }
    orders[index] = finisheOrder

    return response.status(204).json(finisheOrder)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port} 🚀.`)
})