const express = require('express');
const port = 2000;

const app = express();
const uuid = require('uuid');
app.use(express.json());

const orders = [];

const checkOrderId = (request, response, next) => {
    const id = request.params.id;
    const index = orders.findIndex(order => order.id === id);

    if (index < 0) {
        return response.status(404).json({ error: 'Order Not found' });
    }

    request.order = orders[index];
    request.orderId = id;

    next();
};

const checkMethod = (request, response, next) => {
    const method = request.method;
    const url = request.url;
    console.log(`[${method}] - ${url}`);

    next();
};


app.get('/order', (request, response) => {
    return response.json(orders);
});

app.post('/order', (request, response) => {
    const { order, clientName, price, orderStatus } = request.body;
    const newOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparação" };
    orders.push(newOrder);
    return response.status(201).json(newOrder);

});

app.put('/order/:id', checkOrderId, checkMethod, (request, response) => {
    const id = request.params.id;
    const index = orders.findIndex(order => order.id === id);

    const { order, clientName, price, status } = request.body;

    const updatedOrder = { id, order, clientName, price, status };

    orders[index] = updatedOrder;

    return response.status(202).json(updatedOrder);

});

app.delete('/order/:id', checkMethod, checkOrderId, (request, response) => {
    const index = orders.findIndex(order => order.id === request.orderId);

    if (index !== -1) {
        orders.splice(index, 1);
        return response.status(204).json({ message: 'Order excluded' });
    } else {
        return response.status(404).json({ error: 'Order not found' });
    }
});

app.patch('/order/:id', checkMethod, checkOrderId, (request, response) => {
    const id = request.params.id;
    const index = orders.findIndex(order => order.id === id);
    const { status } = request.body;
    const statusChanged = { ...orders[index], status: "Pronto" };
    orders[index] = statusChanged;
    return response.status(200).json(statusChanged);
});


app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`);
});

// Author: José Francisco Moreira Neto (Zequinha)
// Email: byzequinh@gmail.com
// Linkedin: www.linkedin.com/in/zequinha
// GitHub: https://github.com/byzequinha
