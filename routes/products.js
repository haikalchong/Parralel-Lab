const express = require("express")
const router= express.Router();
const {bootstrapField, createProductForm}=require('../forms')

const {Product} = require('../models');
const { fields } = require("forms");

router.get('/', async(req,res)=>{
    let products = await Product.collection().fetch();
    res.render('products/index',{
        'products':products.toJSON()
    })
})

router.get('/create', async (req,res)=>{
    const productForm=createProductForm();
    res.render('products/create',{
        'form':productForm.toHTML(bootstrapField)
    })
})

router.post('/create', async(req,res)=>{
    const productForm = createProductForm();
    productForm.handle(req,{
        'success':async(form)=>{
            const product = new Product();
            product.set('name',form.data.name);
            product.set('cost', form.data.cost);
            product.set('description',form.data.description);
            await product.save();
            res.redirect('/products');
        },
        'error':async (form)=>{
            res.render('products/create',{
                'form':form.toHTML(bootstrapField)
            })
        }
    })
})


router.get('/:product_id/update', async(req,res)=>{
    const productId = req.params.product_id
    const product= await Product.where({
        'id':productId
    }).fetch({
        require:true
    });
    const productForm= createProductForm();

    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value=product.get('description')

    res.render('products/update',{
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })
})


router.post('/:product_id/update', async (req,res)=>{
    const product = await Product.where({
        'id':req.params.product_id
    }).fetch({
        require:true
    });

    const productForm=createProductForm();
    productForm.handle(req,{
        'success':async (form)=>{
            product.set(form.data);
            product.save();
            res.redirect('/products');
        },
        'error' : async (form)=>{
            res.render('products/update',{
                'form':form.toHTML(bootstrapField),
                'product':product.toJSON()
            })
        }
    })
})


router.get('/:product_id/delete',async(req,res)=>{
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require:true
    });
    res.render('products/delete',{
        'product': product.toJSON
    })
})


router.post('/:product_id/delete', async(req,res)=>{
    const product= await Product.where({
        'id': req.params.product_id
    }).fetch({
        require:true
    });
    await product.destroy();
    res.redirect('/products')
})

module.exports = router;