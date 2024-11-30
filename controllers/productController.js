const { Association } = require('sequelize');
const db = require('../../models/index');

const productController = {

    listProduct: (req,res) => {
        Product.findAll()
        .then(function(products) {
            // Retorna solo la lista de productos
            return res.json(products);
        })
        .catch(function(error) {
            return res.status(500).json({ error: error.message });
        });
    },
    createProduct: (req,res) => {
         // Desestructurar los datos del cuerpo de la solicitud (req.body)
         const { nombre, brand, unityPrice, id_category, id_promotion } = req.body;

         // Validar que los campos obligatorios están presentes
         if (!nombre || !brand || !unityPrice || !id_category) {
             return res.status(400).json({
                 success: false,
                 message: 'Todos los campos obligatorios deben ser proporcionados.'
             });
         }
 
         // Crear el nuevo producto
         Product.create({
             nombre: nombre,
             brand: brand,
             unityPrice: unityPrice,
             id_category: id_category,
             id_promotion: id_promotion || null // Es opcional
         })
             .then(newProduct => {
                 // Responder con el nuevo producto creado
                 return res.status(201).json({
                     success: true,
                     message: 'Producto creado exitosamente',
                     data: newProduct
                 });
             })
             .catch(error => {
                 // Manejar errores y responder con el mensaje de error
                 return res.status(500).json({
                     success: false,
                     message: 'Error al crear el producto',
                     error: error.message
                 });
             });
    },
    productDetail: (req,res) => {
         // Obtener el ID del parámetro de la URL
         const productId = req.params.id;

         // Buscar el producto por su ID
         Product.findByPk(productId)
             .then(product => {
                 if (!product) {
                     // Si el producto no existe, enviar una respuesta 404
                     return res.status(404).json({
                         success: false,
                         message: `No se encontró el producto con ID ${productId}`
                     });
                 }
 
                 // Si el producto existe, devolverlo en la respuesta
                 return res.json({
                     success: true,
                     message: 'Producto encontrado',
                     data: product
                 });
             })
             .catch(error => {
                 // Manejo de errores
                 return res.status(500).json({
                     success: false,
                     message: 'Error al obtener el detalle del producto',
                     error: error.message
                 });
             });
    },
    productEditForm: (req,res) => {

        const id_user = req.params.id;
        product.findByPk(id_user).then(product => {
            return res.json({
                success: true,
                message: 'Producto encontrado',
                data: product
            });
        });
    },
    productEdit: (req,res) => {
        const productId = req.params.id;
        const { nombre, brand, unityPrice, id_category, id_promotion } = req.body;

        // Verificar si los datos obligatorios están presentes
        if (!nombre || !brand || !unityPrice || !id_category) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos obligatorios deben ser proporcionados.'
            });
        }

        // Actualizar el producto en la base de datos
        Product.update(
            {
                nombre: nombre,
                brand: brand,
                unityPrice: unityPrice,
                id_category: id_category,
                id_promotion: id_promotion || null
            },
            {
                where: { id: productId }
            }
        )
            .then(([affectedRows]) => {
                if (affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: `No se encontró el producto con ID ${productId}`
                    });
                }
                return res.json({
                    success: true,
                    message: 'Producto actualizado exitosamente'
                });
            })
            .catch(error => {
                return res.status(500).json({
                    success: false,
                    message: 'Error al actualizar el producto',
                    error: error.message
                });
            });
    
    }

}