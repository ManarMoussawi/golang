


Invoices

createInvoice(data) {
    .... managment invoice
    if( ok ){
        // sendEmail client 
        // notify project manager 
        // notify accountant 
        eventEmitter.emit('onInvoiceCreated', myData);
    }
}





Notification 

....

eventEmitter.on("onInvoiceCreated", (myData) => {
    notify x

    notify y
})



// Email 

// eventEmitter.on("onInvoiceCreated", (myData) => {
//     sendEmail x

//     sendEmail y
// })
