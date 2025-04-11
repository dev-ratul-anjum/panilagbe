const Order = require('../models/Order');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");


const SSLCommerzPayment = require('sslcommerz-lts');
const TemporaryOrderSession = require('../models/TemporaryOrderSession');
const TemporarySubscription = require('../models/TemporarySubscription');
const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = !Boolean(process.env.SSLCOMMERZ_IS_SANDBOX);

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  const {
        items,
        name,
        email,
        deliveryAddress,
        phoneNumber,
        totalAmount,
        paymentMethod,
        subscription
      } = req.body;

    
  
  if(paymentMethod === 'cash'){
    const newOrder = new Order({
      user: req.user.id,
      items,
      name,
      email,
      deliveryAddress,
      phoneNumber,
      totalAmount,
      paymentMethod,
    });

    const order = await newOrder.save();

    // Sent a order confirmation email to the user
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASS}`,
      },
    });

    async function main() {
      const info = await transporter.sendMail({
        from: {
          name : 'Panilagbe', 
          address : `${process.env.EMAIL_USER}`
        },
        to: `${email}` ,
        subject: "পানিলাগবে - আপনার অর্ডার সফলভাবে গৃহীত হয়েছে",
        text: `প্রিয় ${name},\n\nআমরা আপনাকে জানাতে পেরে আনন্দিত যে আপনার পানি সরবরাহের অর্ডার সফলভাবে গৃহীত হয়েছে। \n\nঅর্ডার বিবরণ:\nঅর্ডার আইডি: ${order._id}\nমোট মূল্য: ${totalAmount} টাকা\nপেমেন্ট পদ্ধতি: ক্যাশ অন ডেলিভারি\nডেলিভারি ঠিকানা: ${deliveryAddress}\n\nআগামী মাস থেকে প্রতি দুই দিন অন্তর আপনার বাসায় পানি সরবরাহ করা হবে। আমাদের সাথে থাকার জন্য আপনাকে ধন্যবাদ।\n\nযেকোনো প্রশ্ন বা সহায়তার জন্য, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।\n\nধন্যবাদান্তে,\nপানিলাগবে টিম`,
        html: `
        <div style="font-family: 'Bangla', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 20px; background-color: #31A8E2; padding: 15px; border-radius: 8px;">
            <h1 style="color: white; margin: 0;">পানিলাগবে</h1>
            <p style="font-size: 16px; color: white; margin-top: 5px;">আপনার বিশ্বস্ত পানি সরবরাহকারী</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #0891b2; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">অর্ডার নিশ্চিতকরণ</h2>
            <p style="font-size: 16px;">প্রিয় ${name},</p>
            <p style="font-size: 16px;">আমরা আপনাকে জানাতে পেরে আনন্দিত যে আপনার পানি সরবরাহের অর্ডার সফলভাবে গৃহীত হয়েছে।</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h3 style="color: #0891b2; border-bottom: 1px solid #ddd; padding-bottom: 10px;">অর্ডার বিবরণ:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>অর্ডার আইডি:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${order._id}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>মোট মূল্য:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${totalAmount} টাকা</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>পেমেন্ট পদ্ধতি:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">ক্যাশ অন ডেলিভারি</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>ডেলিভারি ঠিকানা:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${deliveryAddress}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #e6f7f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #0891b2;">
            <h3 style="color: #0891b2; margin-top: 0;">ডেলিভারি সময়সূচী</h3>
            <p style="font-size: 16px;">আগামী মাস থেকে <strong>প্রতি দুই দিন অন্তর</strong> আপনার বাসায় পানি সরবরাহ করা হবে।</p>
            <p style="font-size: 16px;">আমরা সর্বদা আপনাকে বিশুদ্ধ ও নিরাপদ পানি সরবরাহ করতে প্রতিশ্রুতিবদ্ধ।</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h3 style="color: #0891b2;">আমাদের সেবাসমূহ:</h3>
            <ul style="padding-left: 20px;">
              <li style="margin-bottom: 8px;">নিয়মিত পানি সরবরাহ</li>
              <li style="margin-bottom: 8px;">বিশুদ্ধ ও নিরাপদ পানি</li>
              <li style="margin-bottom: 8px;">সময়মত ডেলিভারি</li>
              <li style="margin-bottom: 8px;">সহজ অর্ডার প্রক্রিয়া</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
            <p>যেকোনো প্রশ্ন বা সহায়তার জন্য, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।</p>
            <p style="color: #0891b2; font-weight: bold;">ধন্যবাদান্তে,<br>পানিলাগবে টিম</p>
            <div style="margin-top: 15px; font-size: 14px; color: #666;">
              <p>ফোন: ০১৭১২৩৪৫৬৭৮</p>
              <p>ইমেইল: info@panilagbe.com</p>
              <p>ঠিকানা: ঢাকা, বাংলাদেশ</p>
            </div>
          </div>
        </div>
        `,
      });
    }
    main().catch(console.error);

    res.json(order);
  }
  else if(paymentMethod === 'onlinePayment'){
    const tran_id = uuidv4();
    const data = {
      total_amount: totalAmount,
      currency: 'BDT',
      tran_id: tran_id, // use unique tran_id for each api call
      success_url: `http://localhost:7000/api/orders/checkout/success/${tran_id}`,
      fail_url: `http://localhost:7000/api/orders/checkout/fail/${tran_id}`,
      cancel_url: `http://localhost:7000/api/orders/checkout/cancel/${tran_id}`,
      ipn_url: `http://localhost:7000/api/orders/checkout/ipn/${tran_id}`,
      shipping_method: 'Courier',
      product_name: 'Computer.',
      product_category: 'Electronic',
      product_profile: 'general',
      cus_name: name,
      cus_email: email,
      cus_add1: deliveryAddress,
      cus_add2: deliveryAddress,
      cus_city: deliveryAddress,
      cus_state: deliveryAddress,
      cus_postcode: deliveryAddress,
      cus_country: deliveryAddress,
      cus_phone: phoneNumber,
      cus_fax: phoneNumber,
      ship_name: name,
      ship_add1: deliveryAddress,
      ship_add2: deliveryAddress,
      ship_city: deliveryAddress,
      ship_state: deliveryAddress,
      ship_postcode: deliveryAddress,
      ship_country: deliveryAddress,
    };
  
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL;

        // Create Order Session
        const createOrderSession = async () =>{
          try {
            const orderSession = {
              user:  req.user.id,
              items,
              name,
              email,
              deliveryAddress,
              phoneNumber,
              totalAmount,
              paymentMethod,
              subscription : [{paymentId : tran_id, paymentMonth : Number(subscription.paymentMonth), paymentYear : Number(subscription.paymentYear), shownToUser : false}]
            };
            
            // Save this to DB or in-memory store with tran_id
            await TemporaryOrderSession.create({ tran_id, ...orderSession });

            res.json({url: GatewayPageURL});
          } catch (error) {
            res.status(500).json({errors : {common : {msg : error.message}}});
          }
        }
        createOrderSession();
  
    }).catch(err => {
      res.status(500).json({errors : {common : {msg : err.message}}});
    });
  }

};

// Redirect to the success page
exports.checkoutSuccess = async (req, res) => {
  const tranId = req.params.tranId;

  try {
      const {user, items, name, email, deliveryAddress, phoneNumber, totalAmount, paymentMethod, subscription} = await TemporaryOrderSession.findOne({ tran_id : tranId });


      const newOrder = new Order({
         user, items, name, email, deliveryAddress, phoneNumber, totalAmount, paymentMethod, subscription
      });

      const order = await newOrder.save();
      await TemporaryOrderSession.deleteOne({ tran_id : tranId });

      const sub = order.subscription.filter(sub => sub.paymentId === tranId);
      const {paymentMonth, paymentYear} = sub[0];

      // Sent a invoice email to the user
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: `${process.env.EMAIL_USER}`,
          pass: `${process.env.EMAIL_PASS}`,
        },
      });

      async function main() {
        const info = await transporter.sendMail({
          from: {
            name : 'Panilagbe', 
            address : `${process.env.EMAIL_USER}`
          },
          to: `${email}` ,
          subject: "পানিলাগবে - আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে",
          text: `প্রিয় ${name},\n\n আমরা আপনাকে জানাচ্ছি যে আপনার ${totalAmount} টাকা পেমেন্ট সফলভাবে গৃহীত হয়েছে। \n\n পেমেন্ট মাস: ${paymentMonth} পেমেন্ট বছর: ${paymentYear} \n\পেমেন্ট বিবরণ:\nট্রানজেকশন আইডি: ${tranId}\nইমেইল: ${email}\n\nআপনার অর্ডার শীঘ্রই প্রক্রিয়া করা হবে এবং আপনার উল্লেখিত ঠিকানায় পৌঁছে দেওয়া হবে। আপনার সহযোগিতার জন্য ধন্যবাদ।\n\nযেকোনো প্রশ্ন বা সহায়তার জন্য, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।\n\nধন্যবাদান্তে,\nপানিলাগবে টিম`,
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px; ">
              <h1 style="color: #0066cc;">পানিলাগবে</h1>
              <p style="font-size: 18px; color: #333;">আপনার বিশ্বস্ত পানি সরবরাহকারী</p>
            </div>
            
            <div style="margin-bottom: 20px; border-top: 2px solid #0066cc; padding-top: 20px;">
              <h2 style="color: #0066cc;">পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!</h2>
              <p>প্রিয় গ্রাহক,</p>
              <p>আমরা আপনাকে জানাচ্ছি যে আপনার ${totalAmount} টাকা পেমেন্ট সফলভাবে গৃহীত হয়েছে।</p>
              <p>পেমেন্ট মাস: ${paymentMonth} পেমেন্ট বছর: ${paymentYear}</p>
            </div>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="color: #0066cc; border-bottom: 1px solid #ddd; padding-bottom: 10px;">পেমেন্ট বিবরণ:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>ট্রানজেকশন আইডি:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${tranId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>ইমেইল:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${email}</td>
                </tr>
              </table>
              <p style="margin-top: 15px;">আপনার অর্ডার শীঘ্রই প্রক্রিয়া করা হবে এবং আপনার উল্লেখিত ঠিকানায় পৌঁছে দেওয়া হবে।</p>
            </div>
            
            <div style="background-color: #e6f3ff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="color: #0066cc;">আমাদের সেবাসমূহ:</h3>
              <ul style="padding-left: 20px;">
                <li>নিয়মিত পানি সরবরাহ</li>
                <li>বিশুদ্ধ ও নিরাপদ পানি</li>
                <li>সময়মত ডেলিভারি</li>
                <li>সহজ অর্ডার প্রক্রিয়া</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
              <p>যেকোনো প্রশ্ন বা সহায়তার জন্য, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।</p>
              <p style="color: #0066cc;">ধন্যবাদান্তে,<br>পানিলাগবে টিম</p>
            </div>
          </div>
          `,
        });

      }
      main().catch(console.error);

      res.redirect(`${process.env.FRONTEND_URL}/checkout/success/${tranId}`);
  } catch (error) {
    res.status(500).json({errors : {common : {msg : error.message}}});
  }
}

// Redirect to the fail page
exports.checkoutFail = async (req, res) => {
  const tranId = req.params.tranId;

  res.redirect(`${process.env.FRONTEND_URL}/checkout/fail/${tranId}`);
}

// Redirect to the cancel page
exports.checkoutCancel = async (req, res) => {
  const tranId = req.params.tranId;

  res.redirect(`${process.env.FRONTEND_URL}/checkout/cancel/${tranId}`);
}

// @desc    Get all orders for current user
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user : req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ errors : {common : {msg : err.message}} });
  }
};


// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is owner of the order or an admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this order' });
    }

    res.json(order);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    
    // If order is delivered, set delivery date
    if (orderStatus === 'delivered') {
      order.deliveryDate = Date.now();
    }

    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email phone');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 

// get Checkout Success Page
exports.getCheckoutSuccessPage = async (req, res) => {
  const tranId = req.params.tranId;

  try {
    const order = await Order.findOne({ subscription : {$elemMatch : {paymentId : tranId}} });

    if (!order) {
      return res.status(401).json({ success: false });
    }

    let subIndex = null ;
    order.subscription.forEach((sub, index) => {
      if(sub.paymentId === tranId){
        subIndex = index;
      }
    });

    if(subIndex === null){
      return res.status(401).json({ success: false });
    }

    if(order.subscription[subIndex].shownToUser){
      return res.status(403).json({ success: false, message: 'Already viewed' });
    }

    order.subscription[subIndex].shownToUser = true;
    await order.save();
    return res.json({ success: true, order });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// get Checkout Cancel Page
exports.getCheckoutCancelPage = async (req, res) => {
  const tranId = req.params.tranId;

  try {
    const orderSession = await TemporaryOrderSession.findOne({ tran_id : tranId });

    const temporarySubscription = await TemporarySubscription.findOne({ 'subscription.paymentId' : tranId });

    if (!orderSession && !temporarySubscription) {
      return res.json({ success: false });
    }

    if(orderSession){
      await TemporaryOrderSession.deleteOne({ tran_id : tranId });
    }

    if(temporarySubscription){
      await TemporarySubscription.deleteOne({ 'subscription.paymentId' : tranId });
    }

    return res.json({ success: true });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// get Checkout Fail Page
exports.getCheckoutFailPage = async (req, res) => {
  const tranId = req.params.tranId;

  try {
    const orderSession = await TemporaryOrderSession.findOne({ tran_id : tranId });

    const temporarySubscription = await TemporarySubscription.findOne({ 'subscription.paymentId' : tranId });

    if (!orderSession && !temporarySubscription) {
      return res.json({ success: false });
    }

    if(orderSession){
      await TemporaryOrderSession.deleteOne({ tran_id : tranId });
    }

    if(temporarySubscription){
      await TemporarySubscription.deleteOne({ 'subscription.paymentId' : tranId });
    }

    return res.json({ success: true });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}


// PAY ORDER PAYMENT
exports.payOrderPayment = async (req, res) => {
  const { paymentMethod, paymentMonth, paymentYear, orderId, amount } = req.body;

  const order = await Order.findById({_id : orderId});

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const tran_id = uuidv4();
  
  const data = {
    total_amount: amount,
    currency: 'BDT',
    tran_id: tran_id, // use unique tran_id for each api call
    success_url: `http://localhost:7000/api/orders/payment/checkout/success/${tran_id}`,
    fail_url: `http://localhost:7000/api/orders/checkout/fail/${tran_id}`,
    cancel_url: `http://localhost:7000/api/orders/checkout/cancel/${tran_id}`,
    ipn_url: `http://localhost:7000/api/orders/checkout/ipn/${tran_id}`,
    shipping_method: 'Courier',
    product_name: 'Computer.',
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: order.name,
    cus_email: order.email,
    cus_add1: order.deliveryAddress,
    cus_add2: order.deliveryAddress,
    cus_city: order.deliveryAddress,
    cus_state: order.deliveryAddress,
    cus_postcode: order.deliveryAddress,
    cus_country: order.deliveryAddress,
    cus_phone: order.phoneNumber,
    cus_fax: order.phoneNumber,
    ship_name: order.name,
    ship_add1: order.deliveryAddress,
    ship_add2: order.deliveryAddress,
    ship_city: order.deliveryAddress,
    ship_state: order.deliveryAddress,
    ship_postcode: order.deliveryAddress,
    ship_country: order.deliveryAddress,
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  sslcz.init(data).then(apiResponse => {
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL;

      // Save temporary subscription
      const saveTemporarySubscription = async () =>{
        try {
          const temporarySubscription = new TemporarySubscription({
            orderId : order._id,
            subscription : {paymentId : tran_id, paymentMonth : Number(paymentMonth), paymentYear : Number(paymentYear), shownToUser : false}
          });
          await temporarySubscription.save();

          res.json({url: GatewayPageURL});
        } catch (error) {
          res.status(500).json({errors : {common : {msg : error.message}}});
        }
      }
      saveTemporarySubscription();

  }).catch(err => {
    res.status(500).json({errors : {common : {msg : err.message}}});
  });
  
}


exports.paymentCheckoutSuccess = async (req, res) => {
  const tranId = req.params.tranId;

  try {
    const temporarySubscription = await TemporarySubscription.findOne({ 'subscription.paymentId' : tranId });

    if(!temporarySubscription){
      return res.status(404).json({ success: false, message: 'Temporary subscription not found' });
    }

    const order = await Order.findOne({ _id : temporarySubscription.orderId });

    if(!order){
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    order.subscription.push(temporarySubscription.subscription);
    await order.save();

    await TemporarySubscription.deleteOne({ 'subscription.paymentId' : tranId });

    return res.redirect(`${process.env.FRONTEND_URL}/checkout/success/${tranId}`);
    
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
