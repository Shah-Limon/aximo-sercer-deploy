const express = require("express");
const multer = require('multer');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const cors = require("cors");
const nodemailer = require('nodemailer');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Use the original filename for uploaded files
  }
});

const upload = multer({ storage: storage });


const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'limon.working@gmail.com',
    pass: 'gotm ybek jkcb gice'
  }
});

// Endpoint to send email
app.post('/send-email', async (req, res) => {
  const { to, from, subject, message } = req.body;
  const mailOptions = {
    to,
    from,
    subject,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

async function run() {
  try {
    await client.connect();
    /* Seo site collection */
    const db = client.db('seoWebsite');
    const websiteCollections = client.db("seoWebsite").collection("websiteList");

    const packageCollections = client.db("seoWebsite").collection("packages");
    const servicePackageCollections = client.db("seoWebsite").collection("servicePackage");
    const packageTitleCollections = client.db("seoWebsite").collection("packagesTitle");
    const orderCollections = client.db("seoWebsite").collection("orders");
    const paypalEmailCollections = client.db("seoWebsite").collection("email");
    const GeneralCollections = client.db("seoWebsite").collection("general");
    const AboutUsOptionCollections = client.db("seoWebsite").collection("AboutUsOption");
    const BannerOptionCollections = client.db("seoWebsite").collection("Banner");
    const SpecialityOptionCollections = client.db("seoWebsite").collection("Speciality");
    const WhyChooseOptionCollections = client.db("seoWebsite").collection("WhyChooseOption");
    const WhyChooseOptionTitleCollections = client.db("seoWebsite").collection("WhyChooseOptionTitle");
    const RoadMapOptionCollections = client.db("seoWebsite").collection("roadMap");
    const TeamOptionCollections = client.db("seoWebsite").collection("team");
    const TeamTitleOptionCollections = client.db("seoWebsite").collection("teamTitle");
    const TestimonialOptionCollections = client.db("seoWebsite").collection("testimonials");
    const TestimonialTitleOptionCollections = client.db("seoWebsite").collection("testimonialsTitle");
    const FaqsOptionCollections = client.db("seoWebsite").collection("faqs");
    const FaqsTitleCollections = client.db("seoWebsite").collection("faqsTitle");
    const FooterCollections = client.db("seoWebsite").collection("footer");
    const FooterLinkCollections = client.db("seoWebsite").collection("footerLink");
    const sliderCollections = client.db("seoWebsite").collection("slider");
    const ContactPageCollections = client.db("seoWebsite").collection("contactPage");
    const ContactMessageCollections = client.db("seoWebsite").collection("contactMessage");
    const TicketCollections = client.db("seoWebsite").collection("Ticket");
    const TicketReplyCollections = client.db("seoWebsite").collection("TicketReply");
    const newsLetterCollections = client.db("seoWebsite").collection("newsLetter");
    const userCollection = client.db("seoWebsite").collection("users");
    const featurePageCollections = client.db("seoWebsite").collection("features");
    const metaCollections = client.db("seoWebsite").collection("metaInfo");
    const CreateServicesCollections = client.db("seoWebsite").collection("CreateServices");
    const serviceTitleCollections = client.db("seoWebsite").collection("serviceTitle");
    const counterSectionCollections = client.db("seoWebsite").collection("counterSection");
    const counterSectionTitleCollections = client.db("seoWebsite").collection("counterSectionTitle");
    const videoSectionTitleCollections = client.db("seoWebsite").collection("videoSection");
    const chatbotOrderCollections = client.db("seoWebsite").collection("chatbotOrder");
    const helpSectionOptionCollections = client.db("seoWebsite").collection("helpSection");
    const helpSectionTitleOptionCollections = client.db("seoWebsite").collection("helpSectionTitle");
    const leadsCollections = client.db("seoWebsite").collection("leads");
    const userProfileCollections = client.db("seoWebsite").collection("userProfileCollections");
    const myleadsCollections = client.db("seoWebsite").collection("MyAllLeads");
    const myleadsDeletedCollections = client.db("seoWebsite").collection("myleadsDeleted");
    const myleadsNoteCollections = client.db("seoWebsite").collection("MyAllLeadsNote");
    const myleadsColorCollections = client.db("seoWebsite").collection("MyAllLeadsColor");
    const getServicesCollections = client.db("seoWebsite").collection("getServices");
    const invoiceCollections = client.db("seoWebsite").collection("invoice");
    const serviceCollections = client.db("seoWebsite").collection("service");
    const servicePricingCollections = client.db("seoWebsite").collection("servicePricing");
    const employeesCollections = client.db("seoWebsite").collection("employees");
    const customersCollections = client.db("seoWebsite").collection("customers");
    const managersCollections = client.db("seoWebsite").collection("managers");
    const newsLettersCollections = client.db("seoWebsite").collection("newsLetters");
    const apiCollections = client.db("seoWebsite").collection("api");
    const emailCollections = client.db("seoWebsite").collection("fromEmail");
    const employeeProjectsCollections = client.db("seoWebsite").collection("employeeProjects");
    const stripeKeysCollection = client.db('seoWebsite').collection('stripeKeys');
    /* dashboard part start */

    // Create payment intent
    app.post('/create-payment-intent', async (req, res) => {
      const { amount } = req.body;
      const paymentAmount = parseInt(amount * 100);
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: paymentAmount,
          currency: 'usd',
          payment_method_types: ['card']
        });
        res.send({
          clientSecret: paymentIntent.client_secret
        });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });
    /* dashboard part start */


    app.post("/add-service", async (req, res) => {
      const newOrder = req.body;
      const result = await serviceCollections.insertOne(newOrder);
      res.send(result);
    });

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollections.find(query);
      const invoices = await cursor.toArray();
      res.send(invoices);
    });

    app.put("/update-service/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          itemName: edit.itemName,
          itemDescription: edit.itemDescription,
          itemIcon: edit.itemIcon,
        },
      };

      const result = await serviceCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    app.delete("/delete-service/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      try {
        const result = await serviceCollections.deleteOne(filter);
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "Deleted successfully" });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });


    /* getServicesCollections */

    app.post("/add-get-service", async (req, res) => {
      const newOrder = req.body;
      const result = await getServicesCollections.insertOne(newOrder);
      res.send(result);
    });

    app.get("/get-services", async (req, res) => {
      const query = {};
      const cursor = getServicesCollections.find(query);
      const invoices = await cursor.toArray();
      res.send(invoices);
    });

    app.put("/update-get-service/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          serviceName: edit.serviceName,
          serviceDetails: edit.serviceDetails,
        },
      };

      const result = await getServicesCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });



    /* packages */
    app.post("/add-service-pricing", async (req, res) => {
      const newOrder = req.body;
      const result = await servicePricingCollections.insertOne(newOrder);
      res.send(result);
    });

    app.get("/all-service-pricing", async (req, res) => {
      const query = {};
      const cursor = servicePricingCollections.find(query);
      const invoices = await cursor.toArray();
      res.send(invoices);
    });

    app.get("/service-price/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const meta = await servicePricingCollections.findOne(query);
      res.send(meta);
    });

    app.put("/update-service-pricing/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          packageName: edit.packageName,
          serviceId: edit.serviceId,
          packagePrice: edit.packagePrice,
          featureOne: edit.featureOne,
          featureTwo: edit.featureTwo,
          featureThree: edit.featureThree,
          featureFour: edit.featureFour,
          featureFive: edit.featureFive,
          featureSix: edit.featureSix,
          featureSeven: edit.featureSeven,
          featureEight: edit.featureEight,
          featureNine: edit.featureNine,
          featureTen: edit.featureTen,

        },
      };

      const result = await servicePricingCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.delete("/service-price/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      try {
        const result = await servicePricingCollections.deleteOne(filter);
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "Deleted successfully" });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    /* employeesCollections */
    app.post("/add-employee", async (req, res) => {
      const newOrder = req.body;
      const result = await employeesCollections.insertOne(newOrder);
      res.send(result);
    });

    app.get("/employees", async (req, res) => {
      const query = {};
      const cursor = employeesCollections.find(query);
      const invoices = await cursor.toArray();
      res.send(invoices);
    });

    app.put("/update-employee/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          EmployeesName: edit.EmployeesName,
          EmployeesEmail: edit.EmployeesEmail,
          location: edit.location,
          projectName: edit.projectName,
          budget: edit.budget,
          projectEnd: edit.projectEnd,
          advancePaid: edit.advancePaid,
          duePayment: edit.duePayment,
          total: edit.total,

        },
      };

      const result = await employeesCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.delete("/employee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      try {
        const result = await employeesCollections.deleteOne(filter);
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "User deleted successfully" });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });


    /* employeeProjectsCollections */
    app.post("/add-employee-project", async (req, res) => {
      const newOrder = req.body;
      const result = await employeeProjectsCollections.insertOne(newOrder);
      res.send(result);
    });

    app.get("/employee-projects", async (req, res) => {
      let query = {};
      const email = req.query.email;

      if (email) {
        query = { EmployeesEmail: email };
      }

      const cursor = employeeProjectsCollections.find(query);
      const projects = await cursor.toArray();
      res.send(projects);
    });

    app.put("/update-employee/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          EmployeesName: edit.EmployeesName,
          EmployeesEmail: edit.EmployeesEmail,
          location: edit.location,
        },
      };

      const result = await employeeProjectsCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.put("/update-project-status/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          projectStatus: edit.projectStatus,
        },
      };

      const result = await employeeProjectsCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.put("/update-project-project-name/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          projectName: edit.projectName,
        },
      };

      const result = await employeeProjectsCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    /*  */
    app.put("/update-project-project-budget/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          budget: edit.budget,
        },
      };

      const result = await employeeProjectsCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    app.put("/update-project-project-start/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          projectStart: edit.projectStart,
        },
      };

      const result = await employeeProjectsCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    app.put("/update-project-project-end/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          projectEnd: edit.projectEnd,
        },
      };

      const result = await employeeProjectsCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    app.put("/update-project-project-advance-paid/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          advancePaid: edit.advancePaid,
        },
      };

      const result = await employeeProjectsCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    app.put("/update-project-project-due-payment/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          duePayment: edit.duePayment,
        },
      };

      const result = await employeeProjectsCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    app.put("/update-project-project-total/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          total: edit.total,
        },
      };

      const result = await employeeProjectsCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });


    app.delete("/employee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      try {
        const result = await employeeProjectsCollections.deleteOne(filter);
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "User deleted successfully" });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });


    /* newsLettersCollections */
    app.post("/add-news-letter", async (req, res) => {
      const add = req.body;
      const result = await newsLettersCollections.insertOne(add);
      res.send(result);
    });

    app.get("/news-letters", async (req, res) => {
      const query = {};
      const cursor = newsLettersCollections.find(query);
      const news = await cursor.toArray();
      res.send(news);
    });

    app.put("/news-letter/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          newsLettersName: edit.newsLettersName,
          newsLetterFor: edit.newsLetterFor,
          sendTo: edit.sendTo,
          subject: edit.subject,
          message: edit.message,
        },
      };

      const result = await newsLettersCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.delete("/news-letter/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      try {
        const result = await newsLettersCollections.deleteOne(filter);
        if (result.deletedCount === 1) {
          res.status(200).json({ message: " deleted successfully" });
        } else {
          res.status(404).json({ message: " not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });


    /* customersCollections */
    app.post("/add-customer", async (req, res) => {
      const newOrder = req.body;
      const result = await customersCollections.insertOne(newOrder);
      res.send(result);
    });

    app.get("/customers", async (req, res) => {
      const query = {};
      const cursor = customersCollections.find(query);
      const invoices = await cursor.toArray();
      res.send(invoices);
    });

    app.put("/update-customer/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          customerName: edit.customerName,
          customerEmail: edit.customerEmail,
          location: edit.location,
        },
      };

      const result = await customersCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.delete("/delete-customer/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      try {
        const result = await customersCollections.deleteOne(filter);
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "User deleted successfully" });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    /* admin */

    app.post("/add-user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });

    app.get("/user/:id", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });


    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const userUpdate = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          userName: userUpdate.userName,
          userEmail: userUpdate.userEmail,
          location: userUpdate.location,
          userRole: userUpdate.userRole,
        },
      };

      const result = await userCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      try {
        const result = await userCollection.deleteOne(filter);
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "User deleted successfully" });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    /* managersCollections */

    app.post("/add-manager", async (req, res) => {
      const user = req.body;
      const result = await managersCollections.insertOne(user);
      res.send(result);
    });

    app.get("/managers", async (req, res) => {
      const query = {};
      const cursor = managersCollections.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });

    app.get("/manager/:id", async (req, res) => {
      const query = {};
      const cursor = managersCollections.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });


    app.put("/manager/:id", async (req, res) => {
      const id = req.params.id;
      const userUpdate = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          userName: userUpdate.userName,
          userEmail: userUpdate.userEmail,
          location: userUpdate.location,
          userRole: userUpdate.userRole,
        },
      };

      const result = await managersCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.delete("/manager/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      try {
        const result = await managersCollections.deleteOne(filter);
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "User deleted successfully" });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });



    /* apiCollections */
    app.post("/add-api", async (req, res) => {
      const add = req.body;
      const result = await apiCollections.insertOne(add);
      res.send(result);
    });

    app.get("/apis", async (req, res) => {
      const query = {};
      const cursor = apiCollections.find(query);
      const news = await cursor.toArray();
      res.send(news);
    });

    app.put("/api/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          apiName: edit.apiName,
          credentials: edit.credentials,

        },
      };

      const result = await apiCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    /* emailCollections */
    app.post("/add-email", async (req, res) => {
      const add = req.body;
      const result = await emailCollections.insertOne(add);
      res.send(result);
    });

    app.get("/emails", async (req, res) => {
      const query = {};
      const cursor = emailCollections.find(query);
      const news = await cursor.toArray();
      res.send(news);
    });

    app.put("/email-from/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          email: edit.email,
        },
      };

      const result = await emailCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });


    /* dashboard part end */







    /* invoiceCollections */
    app.post("/add-invoice", async (req, res) => {
      const newOrder = req.body;
      const result = await invoiceCollections.insertOne(newOrder);
      res.send(result);
    });

    app.get("/invoices", async (req, res) => {
      const query = {};
      const cursor = invoiceCollections.find(query);
      const invoices = await cursor.toArray();
      res.send(invoices);
    });

    app.get("/all-invoices", async (req, res) => {
      try {
        const { payerEmail } = req.query;
        const query = {};

        if (payerEmail) {
          query.payerEmail = payerEmail;
        }

        const cursor = invoiceCollections.find(query);
        const invoices = await cursor.toArray();
        res.send(invoices);
      } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: 'Internal server error.' });
      }
    });

    app.get("/invoice/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const invoice = await invoiceCollections.findOne(query);
      res.send(invoice);
    });

    app.put('/invoice/:id', async (req, res) => {
      const { id } = req.params;
      const { invoiceStatus } = req.body;

      try {
        const result = await invoiceCollections.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { invoiceStatus } },
          { returnOriginal: false }
        );

        if (result.value) {
          res.status(200).json(result.value);
        } else {
          res.status(404).json({ message: 'Invoice not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });

    app.put('/invoice-mail/:id', async (req, res) => {
      const { id } = req.params;
      const { emailSent } = req.body;

      try {
        const result = await invoiceCollections.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { emailSent } },
          { returnOriginal: false }
        );

        if (result.value) {
          res.status(200).json(result.value);
        } else {
          res.status(404).json({ message: 'Invoice not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });

    /* invoice-cancelled and payment */

    app.put("/invoice-cancelled/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updateOrder = req.body;

        const result = await invoiceCollections.updateOne(
          { _id: new ObjectId(id) },
          { $set: { invoiceStatus: updateOrder.invoiceStatus, payerEmail: updateOrder.payerEmail } }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: 'Invoice not found.' });
        }

        res.json({ message: 'Invoice status updated successfully.' });
      } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: 'Internal server error.' });
      }
    });

    app.put("/invoice-payment/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updateOrder = req.body;

        const result = await invoiceCollections.updateOne(
          { _id: new ObjectId(id) },
          { $set: { invoiceStatus: updateOrder.invoiceStatus, payerEmail: updateOrder.payerEmail } }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: 'Invoice not found.' });
        }

        res.json({ message: 'Invoice status updated successfully.' });
      } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: 'Internal server error.' });
      }
    });




    /*  */
    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'limon.working@gmail.com',
        pass: 'gotm ybek jkcb gice'
      }
    });

    // Endpoint to send email
    app.post('/send-email', async (req, res) => {
      const { to, from, subject, message } = req.body;

      const mailOptions = {
        from,
        to,
        subject,
        text: message
      };

      try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
      }
    });


    // app.post('/sendEmail', async (req, res) => {
    //   try {
    //     const response = await fetch('https://api.resend.com/emails', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer re_SAYcTvFZ_Nn5wnBQDKQBk1ULwLTiiVES7',
    //       },
    //       body: JSON.stringify({
    //         from: 'Acme <onboarding@resend.dev>',
    //         to: ['delivered@resend.dev'],
    //         subject: 'Invoice',
    //         html: `
    //           <div>
    //             <h2>Invoice</h2>
    //             <p>Invoice Number: INV-001</p>
    //             <p>Date: 2024-03-01</p>
    //             <!-- Add more invoice details as needed -->
    //           </div>
    //         `,
    //       }),
    //     });
    //     const responseData = await response.json();
    //     res.json(responseData);

    //   } catch (error) {
    //     console.error('Error sending email:', error);
    //     res.status(500).json({ error: 'An error occurred while sending the email' });
    //   }
    // });


    // app.post('/sendEmail/:id', async (req, res) => {
    //   const { id } = req.params; // Extract the id from request parameters

    //   try {
    //     // Fetch invoice data based on the provided ID
    //     const response = await fetch(`http://localhost:5000/invoice/${id}`);
    //     const invoiceData = await response.json();
    //     console.log(invoiceData)

    //     // Send email using the fetched invoice data
    //     const emailResponse = await fetch('https://api.resend.com/emails', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer re_SAYcTvFZ_Nn5wnBQDKQBk1ULwLTiiVES7',
    //       },
    //       body: JSON.stringify({
    //         from: 'onboarding@resend.dev',
    //         to: 'limon.working@gmail.com',
    //         subject: 'Invoice',
    //         html: `
    //                 <div>
    //                     <h2>Invoice</h2>
    //                     <p>Invoice Number: ${invoiceData.invoiceId}</p>
    //                     <p>Date: ${invoiceData.invoiceDate}</p>
    //                 </div>
    //             `,
    //       }),
    //     });

    //     if (emailResponse.ok) {
    //       // Update the invoice data to mark email sent
    //       await fetch(`http://localhost:5000/invoice-mail/${id}`, {
    //         method: 'PUT',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ emailSent: 'yes' }),
    //       });

    //       const responseData = await emailResponse.json();
    //       res.json(responseData);
    //     } else {
    //       res.status(500).json({ error: 'Failed to send email' });
    //     }
    //   } catch (error) {
    //     console.error('Error sending email:', error);
    //     res.status(500).json({ error: 'An error occurred while sending the email' });
    //   }
    // });







    app.post("/add-lead", async (req, res) => {
      const newOrder = req.body;
      const result = await leadsCollections.insertOne(newOrder);
      res.send(result);
    });

    app.get("/leads", async (req, res) => {
      const query = {};
      const cursor = leadsCollections.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    app.get("/lead/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const order = await leadsCollections.findOne(query);
      res.send(order);
    });


    /* userProfileCollections */

    app.post("/add-profile-info", async (req, res) => {
      const addProfile = req.body;
      const result = await userProfileCollections.insertOne(addProfile);
      res.send(result);
    });

    app.get("/profiles", async (req, res) => {
      const query = {};
      const cursor = userProfileCollections.find(query);
      const profiles = await cursor.toArray();
      res.send(profiles);
    });

    app.get("/profile/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const profile = await userProfileCollections.findOne(query);
      res.send(profile);
    });

    app.put("/update-credit/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          userPoint: edit.userPoint,
        },
      };

      const result = await userProfileCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });



    /*My All Leads */

    app.post("/add-my-lead", async (req, res) => {
      try {
        const lead = req.body;
        const result = await myleadsCollections.insertOne(lead);
        res.status(201).json({ insertedId: result.insertedId }); // Send back the inserted ID
      } catch (error) {
        console.error("Error adding lead:", error);
        res.status(500).json({ error: "Error adding lead" }); // Send back an error response
      }
    });

    app.delete("/my-lead/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      try {
        const result = await myleadsCollections.deleteOne(filter);
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "Deleted successfully" });
        } else {
          res.status(404).json({ message: "Not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });


    app.get("/my-all-leads", async (req, res) => {
      const userEmail = req.query.userEmail; // Assuming email is passed as a query parameter
      const query = { userEmail: userEmail }; // Update the query object
      const cursor = myleadsCollections.find(query);
      const leads = await cursor.toArray();
      res.send(leads);
    });



    app.get("/my-lead/:id", async (req, res) => {
      const leadId = req.params.id;
      const query = { _id: leadId };
      const lead = await myleadsCollections.findOne(query);

      if (lead) {
        res.send(lead);
      } else {
        res.status(404).send("Lead not found");
      }
    });

    app.put("/my-lead-delete-status/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          deleteStatus: edit.deleteStatus,
        },
      };
      const result = await myleadsDeletedCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });


    /* note */


    app.get("/my-all-leads-note", async (req, res) => {
      const query = {};
      const cursor = myleadsNoteCollections.find(query);
      const leads = await cursor.toArray();
      res.send(leads);
    });

    app.get("/my-lead-note/:id", async (req, res) => {
      const leadId = req.params.id;
      const query = { _id: leadId };
      const lead = await myleadsNoteCollections.findOne(query);

      if (lead) {
        res.send(lead);
      } else {
        res.status(404).send("Lead not found");
      }
    });

    app.put("/my-lead-email-status/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          emailSent: edit.emailSent,
        },
      };

      const result = await myleadsNoteCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.put("/lead-note/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          Note: edit.Note,
        },
      };

      const result = await myleadsNoteCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* color */


    app.get("/my-all-leads-color", async (req, res) => {
      const query = {};
      const cursor = myleadsColorCollections.find(query);
      const leads = await cursor.toArray();
      res.send(leads);
    });

    app.get("/my-lead-color/:id", async (req, res) => {
      const leadId = req.params.id;
      const query = { _id: leadId };
      const lead = await myleadsColorCollections.findOne(query);

      if (lead) {
        res.send(lead);
      } else {
        res.status(404).send("Lead not found");
      }
    });

    app.put("/lead-color/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          leadColor: edit.leadColor,
        },
      };

      const result = await myleadsColorCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });







    /* chatbotOrderCollections */
    app.post("/chatbot-new-order", async (req, res) => {
      const newOrder = req.body;
      const result = await chatbotOrderCollections.insertOne(newOrder);
      res.send(result);
    });

    app.get("/chatbot-new-orders", async (req, res) => {
      const query = {};
      const cursor = chatbotOrderCollections.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    app.get("/chatbot-new-order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const order = await chatbotOrderCollections.findOne(query);
      res.send(order);
    });

    app.put("/chatbot-new-order-update/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          email: edit.email,
          website: edit.website,
          metaDescription: edit.metaDescription,
          mobileFriendly: edit.mobileFriendly,
          pageLoadSpeed: edit.pageLoadSpeed,
          ssl: edit.ssl,
          sitemap: edit.sitemap,
          brokenLinks: edit.brokenLinks,
          ux: edit.ux,
          backlinks: edit.backlinks,
          img: edit.img,
          pdfLink: edit.pdfLink,
          auditStatus: edit.auditStatus,

        },
      };

      const result = await chatbotOrderCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });



    app.put("/payment-cancelled/:id", async (req, res) => {
      const id = req.params.id;
      const updateOrder = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          paymentStatus: updateOrder.paymentStatus,
        },
      };

      const result = await orderCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.put("/payment-received/:id", async (req, res) => {
      const id = req.params.id;
      const updateOrder = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          paymentStatus: updateOrder.paymentStatus,
          paymentGateway: updateOrder.paymentGateway,
        },
      };

      const result = await orderCollections.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

    /* Seo site post */

    app.post("/add-website", async (req, res) => {
      const websiteCheck = req.body;
      const result = await websiteCollections.insertOne(websiteCheck);
      res.send(result);
    });

    app.get("/website", async (req, res) => {
      const query = {};
      const cursor = websiteCollections.find(query);
      const websiteCheck = await cursor.toArray();
      res.send(websiteCheck);
    });

    app.get("/website/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const website = await websiteCollections.findOne(query);
      res.send(website);
    });

    app.put("/edit-website/:id", async (req, res) => {
      const id = req.params.id;
      const edit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          email: edit.email,
          website: edit.website,
          metaDescription: edit.metaDescription,
          mobileFriendly: edit.mobileFriendly,
          pageLoadSpeed: edit.pageLoadSpeed,
          ssl: edit.ssl,
          sitemap: edit.sitemap,
          brokenLinks: edit.brokenLinks,
          ux: edit.ux,
          backlinks: edit.backlinks,
          img: edit.img,
          pdfLink: edit.pdfLink,
          auditStatus: edit.auditStatus,

        },
      };

      const result = await websiteCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* Packages */
    app.post("/add-package", async (req, res) => {
      const package = req.body;
      const result = await packageCollections.insertOne(package);
      res.send(result);
    });

    app.get("/packages", async (req, res) => {
      const query = {};
      const cursor = packageCollections.find(query);
      const packages = await cursor.toArray();
      res.send(packages);
    });

    app.get("/package/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const package = await packageCollections.findOne(query);
      res.send(package);
    });

    app.put("/edit-package/:id", async (req, res) => {
      const id = req.params.id;
      const package = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          packageName: package.packageName,
          price: package.price,
          featureOne: package.featureOne,
          featureTwo: package.featureTwo,
          featureThree: package.featureThree,
          featureFour: package.featureFour,
          featureFive: package.featureFive,
          featureSix: package.featureSix,
          featureSeven: package.featureSeven,
          featureEight: package.featureEight,
          featureNine: package.featureNine,
          featureTen: package.featureTen,
        },
      };

      const result = await packageCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });



    app.post("/add-package-title", async (req, res) => {
      const packageTitle = req.body;
      const result = await packageTitleCollections.insertOne(packageTitle);
      res.send(result);
    });

    app.get("/package-titles/", async (req, res) => {
      const query = {};
      const cursor = packageTitleCollections.find(query);
      const packageTitle = await cursor.toArray();
      res.send(packageTitle);
    });
    app.get("/package-title/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const packageTitle = await packageTitleCollections.findOne(query);
      res.send(packageTitle);
    });


    app.put("/package-title/:id", async (req, res) => {
      const id = req.params.id;
      const packageTitle = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          titleTop: packageTitle.titleTop,
          titleOne: packageTitle.titleOne,
          titleTwo: packageTitle.titleTwo,
          description: packageTitle.description,
        },
      };

      const result = await packageTitleCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /*  */

    /* Order */
    app.post("/new-order", async (req, res) => {
      const order = req.body;
      const result = await orderCollections.insertOne(order);
      res.send(result);
    });

    app.get("/orders", async (req, res) => {
      const query = {};
      const cursor = orderCollections.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    app.get("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const order = await orderCollections.findOne(query);
      res.send(order);
    });


    app.put("/order-status/:id", async (req, res) => {
      const id = req.params.id;
      const updateOrder = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          orderStatus: updateOrder.orderStatus,
          paymentStatus: updateOrder.paymentStatus,
        },
      };

      const result = await orderCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    app.put("/pay-order-status/:id", async (req, res) => {
      const id = req.params.id;
      const updateOrder = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          paymentGateway: updateOrder.paymentGateway,
          paymentStatus: updateOrder.paymentStatus,
        },
      };

      const result = await orderCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /*  */

    /* payment */

    app.post("/payment", async (req, res) => {
      const email = req.body;
      const result = await paypalEmailCollections.insertOne(email);
      res.send(result);
    });

    app.get("/payments", async (req, res) => {
      const query = {};
      const cursor = paypalEmailCollections.find(query);
      const email = await cursor.toArray();
      res.send(email);
    });
    app.get("/payment/:id", async (req, res) => {
      const query = {};
      const cursor = paypalEmailCollections.find(query);
      const email = await cursor.toArray();
      res.send(email);
    });

    app.put("/payment/:id", async (req, res) => {
      const id = req.params.id;
      const updateEmail = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          email: updateEmail.email,
        },
      };

      const result = await paypalEmailCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    /*  */

    /* User Manage */






    /* payment */


    /* general Setting */

    app.post("/add-logo", async (req, res) => {
      const logo = req.body;
      const result = await GeneralCollections.insertOne(logo);
      res.send(result);
    });

    app.get("/logo", async (req, res) => {
      const query = {};
      const cursor = GeneralCollections.find(query);
      const logo = await cursor.toArray();
      res.send(logo);
    });
    app.get("/logo/:id", async (req, res) => {
      const query = {};
      const cursor = GeneralCollections.find(query);
      const logo = await cursor.toArray();
      res.send(logo);
    });

    app.put("/logo/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          logo: updateData.logo,
        },
      };

      const result = await GeneralCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* payment */




    /* About Us Option Setting */

    app.post("/add-about", async (req, res) => {
      const about = req.body;
      const result = await AboutUsOptionCollections.insertOne(about);
      res.send(result);
    });

    app.get("/about", async (req, res) => {
      const query = {};
      const cursor = AboutUsOptionCollections.find(query);
      const about = await cursor.toArray();
      res.send(about);
    });
    app.get("/about/:id", async (req, res) => {
      const query = {};
      const cursor = AboutUsOptionCollections.find(query);
      const about = await cursor.toArray();
      res.send(about);
    });

    app.put("/edit-about/:id", async (req, res) => {
      const id = req.params.id;
      const updateAbout = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          imgOne: updateAbout.imgOne,
          btnText: updateAbout.btnText,
          btnUrl: updateAbout.btnUrl,
          title: updateAbout.title,
          aboutDescription: updateAbout.aboutDescription,

          cardNumberOne: updateAbout.cardNumberOne,
          cardTextOne: updateAbout.cardTextOne,

          cardNumberTwo: updateAbout.cardNumberTwo,
          cardTextTwo: updateAbout.cardTextTwo,

          cardNumberThree: updateAbout.cardNumberThree,
          cardTextThree: updateAbout.cardTextThree,

          cardNumberFour: updateAbout.cardNumberFour,
          cardTextFour: updateAbout.cardTextFour,
        },
      };

      const result = await AboutUsOptionCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* Banner area */


    app.post("/add-banner", async (req, res) => {
      const banner = req.body;
      const result = await BannerOptionCollections.insertOne(banner);
      res.send(result);
    });

    app.get("/banner", async (req, res) => {
      const query = {};
      const cursor = BannerOptionCollections.find(query);
      const banner = await cursor.toArray();
      res.send(banner);
    });

    app.get("/banner/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const help = await BannerOptionCollections.findOne(query);
      res.send(help);
    });




    app.put("/edit-banner/:id", async (req, res) => {
      const id = req.params.id;
      const updateBanner = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          topTitle: updateBanner.topTitle,
          title: updateBanner.title,
          btnText: updateBanner.btnText,
          btnLink: updateBanner.btnLink,
          backgroundImage: updateBanner.backgroundImage,
        },
      };

      const result = await BannerOptionCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* end */
    /* Our speciality area */


    app.post("/add-speciality", async (req, res) => {
      const speciality = req.body;
      const result = await SpecialityOptionCollections.insertOne(speciality);
      res.send(result);
    });

    app.get("/speciality", async (req, res) => {
      const query = {};
      const cursor = SpecialityOptionCollections.find(query);
      const speciality = await cursor.toArray();
      res.send(speciality);
    });

    app.get("/speciality/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const team = await SpecialityOptionCollections.findOne(query);
      res.send(team);
    });


    app.put("/edit-speciality/:id", async (req, res) => {
      const id = req.params.id;
      const updateSpeciality = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          titleTop: updateSpeciality.titleTop,
          title: updateSpeciality.title,
          description: updateSpeciality.description,
          imageOne: updateSpeciality.imageOne,
          btnText: updateSpeciality.btnText,
          btnUrl: updateSpeciality.btnUrl,
        },
      };

      const result = await SpecialityOptionCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* end */


    /* Why  choose area */


    app.post("/add-why", async (req, res) => {
      const choose = req.body;
      const result = await WhyChooseOptionCollections.insertOne(choose);
      res.send(result);
    });

    app.get("/why-choose", async (req, res) => {
      const query = {};
      const cursor = WhyChooseOptionCollections.find(query);
      const choose = await cursor.toArray();
      res.send(choose);
    });



    app.get("/why-choose/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const team = await WhyChooseOptionCollections.findOne(query);
      res.send(team);
    });




    app.put("/edit-why-choose/:id", async (req, res) => {
      const id = req.params.id;
      const updateChoose = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          title: updateChoose.title,
          description: updateChoose.description,
          image: updateChoose.image,
        },
      };

      const result = await WhyChooseOptionCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });



    app.delete("/delete-why-choose/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await WhyChooseOptionCollections.deleteOne(query);
      if (result.deletedCount === 1) {
        res.send("Deleted successfully");
      } else {
        res.status(404).send("Not found");
      }
    });

    /*HelpSection area helpSectionOptionCollections */


    app.post("/add-help", async (req, res) => {
      const help = req.body;
      const result = await helpSectionOptionCollections.insertOne(help);
      res.send(result);
    });

    app.get("/all-help-section", async (req, res) => {
      const query = {};
      const cursor = helpSectionOptionCollections.find(query);
      const helps = await cursor.toArray();
      res.send(helps);
    });



    app.get("/help-section/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const help = await helpSectionOptionCollections.findOne(query);
      res.send(help);
    });




    app.put("/edit-help-section/:id", async (req, res) => {
      const id = req.params.id;
      const updateChoose = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          title: updateChoose.title,
          description: updateChoose.description,
          image: updateChoose.image,
        },
      };

      const result = await helpSectionOptionCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });



    app.delete("/delete-help/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await helpSectionOptionCollections.deleteOne(query);
      if (result.deletedCount === 1) {
        res.send("Deleted successfully");
      } else {
        res.status(404).send("Not found");
      }
    });

    /* end */

    /* help title option helpSectionTitleOptionCollections*/


    app.get("/help-section-title", async (req, res) => {
      const query = {};
      const cursor = helpSectionTitleOptionCollections.find(query);
      const choose = await cursor.toArray();
      res.send(choose);
    });
    app.get("/help-sections-title/:id", async (req, res) => {
      const query = {};
      const cursor = helpSectionTitleOptionCollections.find(query);
      const choose = await cursor.toArray();
      res.send(choose);
    });

    app.put("/edit-help-section-title/:id", async (req, res) => {
      const id = req.params.id;
      const updateChoose = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          title: updateChoose.title,
          titleTop: updateChoose.titleTop,
        },
      };

      const result = await helpSectionTitleOptionCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* end */









    /* Why  WhyChooseOptionTitleCollections */


    app.get("/why-choose-title", async (req, res) => {
      const query = {};
      const cursor = WhyChooseOptionTitleCollections.find(query);
      const choose = await cursor.toArray();
      res.send(choose);
    });
    app.get("/why-choose-title/:id", async (req, res) => {
      const query = {};
      const cursor = WhyChooseOptionTitleCollections.find(query);
      const choose = await cursor.toArray();
      res.send(choose);
    });

    app.put("/edit-why-choose-title/:id", async (req, res) => {
      const id = req.params.id;
      const updateChoose = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          title: updateChoose.title,
          titleTop: updateChoose.titleTop,
        },
      };

      const result = await WhyChooseOptionTitleCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* end */

    /* Road Map area */


    app.post("/add-road", async (req, res) => {
      const road = req.body;
      const result = await RoadMapOptionCollections.insertOne(road);
      res.send(result);
    });

    app.get("/road", async (req, res) => {
      const query = {};
      const cursor = RoadMapOptionCollections.find(query);
      const road = await cursor.toArray();
      res.send(road);
    });



    app.get("/road/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const road = await RoadMapOptionCollections.findOne(query);
      res.send(road);
    });

    app.put("/edit-road/:id", async (req, res) => {
      const id = req.params.id;
      const updateRoad = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          titleTop: updateRoad.titleTop,
          title: updateRoad.title,
          cardTitleOne: updateRoad.cardTitleOne,
          descriptionOne: updateRoad.descriptionOne,

          descriptionTwo: updateRoad.descriptionTwo,
          cardTitleTwo: updateRoad.cardTitleTwo,

          cardTitleThree: updateRoad.cardTitleThree,
          descriptionThree: updateRoad.descriptionThree,

          cardTitleFour: updateRoad.cardTitleFour,
          descriptionFour: updateRoad.descriptionFour,

        },
      };

      const result = await RoadMapOptionCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* end */





    /* Team Members */

    app.post("/add-team", async (req, res) => {
      const team = req.body;
      const result = await TeamOptionCollections.insertOne(team);
      res.send(result);
    });

    app.get("/teams", async (req, res) => {
      const query = {};
      const cursor = TeamOptionCollections.find(query);
      const team = await cursor.toArray();
      res.send(team);
    });
    app.get("/team/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const team = await TeamOptionCollections.findOne(query);
      res.send(team);
    });


    app.put("/team/:id", async (req, res) => {
      const id = req.params.id;
      const team = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          personName: team.personName,
          personImg: team.personImg,
          personTitle: team.personTitle,
          facebook: team.facebook,
          twitter: team.twitter,
        },
      };

      const result = await TeamOptionCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* team */

    /* Team area Title */


    app.post("/add-team-title", async (req, res) => {
      const teamTitle = req.body;
      const result = await TeamTitleOptionCollections.insertOne(teamTitle);
      res.send(result);
    });

    app.get("/team-title", async (req, res) => {
      const query = {};
      const cursor = TeamTitleOptionCollections.find(query);
      const teamTitle = await cursor.toArray();
      res.send(teamTitle);
    });
    app.get("/team-title/:id", async (req, res) => {
      const query = {};
      const cursor = TeamTitleOptionCollections.find(query);
      const teamTitle = await cursor.toArray();
      res.send(teamTitle);
    });

    app.put("/edit-team-title/:id", async (req, res) => {
      const id = req.params.id;
      const updateTeamTitle = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          titleTopText: updateTeamTitle.titleTopText,
          TitleOne: updateTeamTitle.TitleOne,
          titleTwo: updateTeamTitle.titleTwo,



        },
      };

      const result = await TeamTitleOptionCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* end */


    /* testimonial */

    app.post("/testimonial", async (req, res) => {
      const testimonial = req.body;
      const result = await TestimonialOptionCollections.insertOne(testimonial);
      res.send(result);
    });

    app.get("/testimonials", async (req, res) => {
      const query = {};
      const cursor = TestimonialOptionCollections.find(query);
      const testimonial = await cursor.toArray();
      res.send(testimonial);
    });


    app.get("/testimonial/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const testimonial = await TestimonialOptionCollections.findOne(query);
      res.send(testimonial);
    });

    app.delete("/testimonial/:id", async (req, res) => {
      const id = req.params.id; // Get the ID from the URL
      const query = { _id: new ObjectId(id) }; // Filter by ID
      const result = await TestimonialOptionCollections.deleteOne(query); // Delete the document
      if (result.deletedCount === 1) {
        res.send("Testimonial deleted successfully");
      } else {
        res.status(404).send("Testimonial not found");
      }
    });



    app.put("/testimonial/:id", async (req, res) => {
      const id = req.params.id;
      const testimonial = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          personName: testimonial.personName,
          personTitle: testimonial.personTitle,
          personImg: testimonial.personImg,
          desc: testimonial.desc,
        },
      };

      const result = await TestimonialOptionCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* testimonial */



    /* testimonial title */

    app.post("/testimonial-title", async (req, res) => {
      const testimonialTitle = req.body;
      const result = await TestimonialTitleOptionCollections.insertOne(testimonialTitle);
      res.send(result);
    });

    app.get("/testimonials-title", async (req, res) => {
      const query = {};
      const cursor = TestimonialTitleOptionCollections.find(query);
      const testimonialTitle = await cursor.toArray();
      res.send(testimonialTitle);
    });


    app.get("/testimonial-title/:id", async (req, res) => {
      const id = req.params.id; // Get the ID from the URL
      const query = { _id: new ObjectId(id) }; // Filter by ID
      const testimonialTitle = await TestimonialTitleOptionCollections.findOne(query); // Use findOne to get a single testimonial
      res.send(testimonialTitle);
    });




    app.put("/testimonial-title/:id", async (req, res) => {
      const id = req.params.id;
      const testimonialTitle = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          title: testimonialTitle.title,
          description: testimonialTitle.description,
          img: testimonialTitle.img,
        },
      };

      const result = await TestimonialTitleOptionCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* testimonial */






    /* faqs */

    app.post("/faq", async (req, res) => {
      const faq = req.body;
      const result = await FaqsOptionCollections.insertOne(faq);
      res.send(result);
    });


    app.get("/faqs", async (req, res) => {
      const query = {};
      const cursor = FaqsOptionCollections.find(query);
      const faqs = await cursor.toArray();
      res.send(faqs);
    });


    app.get("/faq/:id", async (req, res) => {
      const id = req.params.id; // Get the ID from the URL
      const query = { _id: new ObjectId(id) }; // Filter by ID
      const faq = await FaqsOptionCollections.findOne(query); // Use findOne to get a single testimonial
      res.send(faq);
    });
    app.delete("/faq/:id", async (req, res) => {
      const id = req.params.id; // Get the ID from the URL
      const query = { _id: new ObjectId(id) }; // Filter by ID
      const faq = await FaqsOptionCollections.deleteOne(query); // Delete the document
      if (faq.deletedCount === 1) {
        res.send("Testimonial deleted successfully");
      } else {
        res.status(404).send("Testimonial not found");
      }
    });



    app.put("/faq/:id", async (req, res) => {
      const id = req.params.id;
      const faq = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          answer: faq.answer,
          question: faq.question,

        },
      };

      const result = await FaqsOptionCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* title */
    app.post("/faq-title", async (req, res) => {
      const faq = req.body;
      const result = await FaqsTitleCollections.insertOne(faq);
      res.send(result);
    });
    app.get("/faqs-title", async (req, res) => {
      const query = {};
      const cursor = FaqsTitleCollections.find(query);
      const faqs = await cursor.toArray();
      res.send(faqs);
    });
    app.get("/faq-title/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const faq = await FaqsTitleCollections.findOne(query);
      res.send(faq);
    });

    app.put("/faq-title/:id", async (req, res) => {
      const id = req.params.id;
      const faq = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          title: faq.title,
          btnText: faq.btnText,
          btnUrl: faq.btnUrl,
        },
      };

      const result = await FaqsTitleCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });


    /* faqs */

    /* footer area */



    app.post("/footer-social", async (req, res) => {
      const footerSocial = req.body;
      const result = await FooterCollections.insertOne(footerSocial);
      res.send(result);
    });

    app.get("/footer-social", async (req, res) => {
      const query = {};
      const cursor = FooterCollections.find(query);
      const footerSocial = await cursor.toArray();
      res.send(footerSocial);
    });


    app.get("/footer-social/:id", async (req, res) => {
      const id = req.params.id; // Get the ID from the URL
      const query = { _id: new ObjectId(id) }; // Filter by ID
      const footerSocial = await FooterCollections.findOne(query); // Use findOne to get a single testimonial
      res.send(footerSocial);
    });




    app.put("/footer-social/:id", async (req, res) => {
      const id = req.params.id;
      const footerSocial = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          facebook: footerSocial.facebook,
          twitter: footerSocial.twitter,
          instragram: footerSocial.instragram,
          youtube: footerSocial.youtube,
          email: footerSocial.email,

        },
      };

      const result = await FooterCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });


    /* footer area end */
    /* footer Links */



    app.post("/footer-link", async (req, res) => {
      const footerLink = req.body;
      const result = await FooterLinkCollections.insertOne(footerLink);
      res.send(result);
    });

    app.get("/footer-links", async (req, res) => {
      const query = {};
      const cursor = FooterLinkCollections.find(query);
      const footerLink = await cursor.toArray();
      res.send(footerLink);
    });


    app.get("/footer-link/:id", async (req, res) => {
      const id = req.params.id; // Get the ID from the URL
      const query = { _id: new ObjectId(id) }; // Filter by ID
      const footerLink = await FooterLinkCollections.findOne(query); // Use findOne to get a single testimonial
      res.send(footerLink);
    });




    app.put("/footer-link/:id", async (req, res) => {
      const id = req.params.id;
      const footerLink = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {

          FooterAbout: footerLink.FooterAbout,
          CopyRight: footerLink.CopyRight,


        },
      };

      const result = await FooterLinkCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });


    /* footer area end */


    /* SliderCollections */

    app.post("/slider", async (req, res) => {
      const slider = req.body;
      const result = await sliderCollections.insertOne(slider);
      res.send(result);
    });

    app.get("/sliders", async (req, res) => {
      const query = {};
      const cursor = sliderCollections.find(query);
      const slider = await cursor.toArray();
      res.send(slider);
    });


    app.get("/slider/:id", async (req, res) => {
      const id = req.params.id; // Get the ID from the URL
      const query = { _id: new ObjectId(id) }; // Filter by ID
      const slider = await sliderCollections.findOne(query); // Use findOne to get a single testimonial
      res.send(slider);
    });




    app.put("/slider/:id", async (req, res) => {
      const id = req.params.id;
      const sliderUpdate = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          sliderTitle: sliderUpdate.sliderTitle,
          sliderDesc: sliderUpdate.sliderDesc,
          sliderImg: sliderUpdate.sliderImg,




        },
      };

      const result = await sliderCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* testimonial */


    /* Contact Page */



    app.post("/add-contact", async (req, res) => {
      const contact = req.body;
      const result = await ContactPageCollections.insertOne(contact);
      res.send(result);
    });

    app.get("/contact", async (req, res) => {
      const query = {};
      const cursor = ContactPageCollections.find(query);
      const contact = await cursor.toArray();
      res.send(contact);
    });


    app.get("/contact/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const contact = await ContactPageCollections.findOne(query);
      res.send(contact);
    });
    app.delete("/contact/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ContactPageCollections.deleteOne(query);
      if (result.deletedCount === 1) {
        res.send("Testimonial deleted successfully");
      } else {
        res.status(404).send("Testimonial not found");
      }
    });



    app.put("/contact/:id", async (req, res) => {
      const id = req.params.id;
      const contact = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          description: contact.description,
          titleOne: contact.titleOne,
          titleTwo: contact.titleTwo,
          address: contact.address,
          phone: contact.phone,
          email: contact.email,
          img: contact.img,

        },
      };

      const result = await ContactPageCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* contact */




    /* contact us message */

    app.post("/add-contact-message", async (req, res) => {
      const contact = req.body;
      const result = await ContactMessageCollections.insertOne(contact);
      res.send(result);
    });

    app.get("/contact-messages", async (req, res) => {
      try {
        const { status } = req.query; // Assuming you pass status as a query parameter
        const query = status ? { messageStatus: status } : {}; // If status is provided, filter by it
        const cursor = ContactMessageCollections.find(query);
        const contactMessages = await cursor.toArray();
        res.send(contactMessages);
      } catch (error) {
        console.error('Error retrieving contact messages:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    app.get("/contact-message/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const contact = await ContactMessageCollections.findOne(query);
      res.send(contact);
    });

    app.put("/contact-message/:id", async (req, res) => {
      const id = req.params.id;
      const contact = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          messageStatus: contact.messageStatus,

        },
      };

      const result = await ContactMessageCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });




    /* Ticket area */




    app.post("/add-ticket", async (req, res) => {
      const ticket = req.body;
      const result = await TicketCollections.insertOne(ticket);
      res.send(result);
    });

    app.get("/tickets", async (req, res) => {
      const query = {};
      const cursor = TicketCollections.find(query);
      const ticket = await cursor.toArray();
      res.send(ticket);
    });


    app.get("/ticket/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const ticket = await TicketCollections.findOne(query);
      res.send(ticket);
    });





    app.put("/ticket/:id", async (req, res) => {
      const id = req.params.id;
      const ticket = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          ticketStatus: ticket.ticketStatus,

        },
      };

      const result = await TicketCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* ticket */



    /* Ticket Reply Collections */

    app.post("/add-ticket-reply/", async (req, res) => {
      const ticketReply = req.body;
      const result = await TicketReplyCollections.insertOne(ticketReply);
      res.send(result);
    });

    app.get("/reply-tickets/", async (req, res) => {
      const query = {};
      const cursor = TicketReplyCollections.find(query);
      const ticketReply = await cursor.toArray();
      res.send(ticketReply);
    });










    /* newsLetter */

    app.post("/add-newsLetter/", async (req, res) => {
      const newsLetter = req.body;
      const result = await newsLetterCollections.insertOne(newsLetter);
      res.send(result);
    });

    app.get("/subscription-email/", async (req, res) => {
      const query = {};
      const cursor = newsLetterCollections.find(query);
      const newsLetter = await cursor.toArray();
      res.send(newsLetter);
    });



    /* feature Page */



    app.post("/add-feature", async (req, res) => {
      const feature = req.body;
      const result = await featurePageCollections.insertOne(feature);
      res.send(result);
    });

    app.get("/features", async (req, res) => {
      const query = {};
      const cursor = featurePageCollections.find(query);
      const feature = await cursor.toArray();
      res.send(feature);
    });


    app.get("/feature/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const feature = await featurePageCollections.findOne(query);
      res.send(feature);
    });




    app.put("/feature/:id", async (req, res) => {
      const id = req.params.id;
      const feature = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {

          topText: feature.topText,
          title: feature.title,
          subText: feature.subText,
          featureTitle: feature.featureTitle,
          featureImg: feature.featureImg,
          featureDesc: feature.featureDesc,


        },
      };

      const result = await featurePageCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* meta */



    app.get("/meta-infomations", async (req, res) => {
      const query = {};
      const cursor = metaCollections.find(query);
      const meta = await cursor.toArray();
      res.send(meta);
    });

    app.get("/meta-infomation/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const meta = await metaCollections.findOne(query);
      res.send(meta);
    });

    app.put("/meta-infomation/:id", async (req, res) => {
      const id = req.params.id;
      const meta = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          homeTitle: meta.homeTitle,
          homeDescription: meta.homeDescription,
          serviceTitle: meta.serviceTitle,
          serviceDescription: meta.serviceDescription,
          pricingTitle: meta.pricingTitle,
          pricingDescription: meta.pricingDescription,
          aboutTitle: meta.aboutTitle,
          aboutDescription: meta.aboutDescription,
          contactTitle: meta.contactTitle,
          contactDescription: meta.contactDescription,
        },
      };

      const result = await metaCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* CreateServicesCollections */

    app.post("/add-service", async (req, res) => {
      const addService = req.body;
      const result = await CreateServicesCollections.insertOne(addService);
      res.send(result);
    });


    app.get("/services-list", async (req, res) => {
      const query = {};
      const cursor = CreateServicesCollections.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/service-list/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const service = await CreateServicesCollections.findOne(query);
      res.send(service);
    });

    app.get('/service/:slug', async (req, res) => {
      const { slug } = req.params;
      try {
        const db = client.db('seoWebsite');
        const collection = db.collection('CreateServices');
        // Find the service by slug in MongoDB
        const service = await collection.findOne({ postSlug: slug });
        if (!service) {
          return res.status(404).json({ error: 'Service not found' });
        }
        res.json(service);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });



    app.put("/update-service-list/:id", async (req, res) => {
      const id = req.params.id;
      const updateService = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          title: updateService.title,
          description: updateService.description,
          img: updateService.img,
          postSlug: updateService.postSlug,
        },
      };

      const result = await CreateServicesCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.get('/check-slug/:slug', async (req, res) => {
      const slugToCheck = req.params.slug;
      try {
        const query = { postSlug: slugToCheck };
        const matchingPosts = await CreateServicesCollections.find(query).toArray();
        const existingSlugs = matchingPosts.map(post => post.postSlug);

        res.send(existingSlugs);
      } catch (error) {
        console.error('Error checking slug:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    app.delete("/service/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      try {
        const result = await CreateServicesCollections.deleteOne(filter);
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "service deleted successfully" });
        } else {
          res.status(404).json({ message: "service not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    /* servicePackageCollections */
    app.post("/add-service-package", async (req, res) => {
      const servicePackage = req.body;
      const result = await servicePackageCollections.insertOne(servicePackage);
      res.send(result);
    });

    app.get("/service-packages", async (req, res) => {
      const query = {};
      const cursor = servicePackageCollections.find(query);
      const servicePackages = await cursor.toArray();
      res.send(servicePackages);
    });


    app.get("/service-package/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const servicePackage = await servicePackageCollections.findOne(query);
      res.send(servicePackage);
    });




    app.put("/service-package/:id", async (req, res) => {
      const id = req.params.id;
      const servicePackageUpdate = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          packageName: servicePackageUpdate.packageName,
          price: servicePackageUpdate.price,
          img: servicePackageUpdate.img,
          featureOne: servicePackageUpdate.featureOne,
          featureTwo: servicePackageUpdate.featureTwo,
          featureThree: servicePackageUpdate.featureThree,
          featureFour: servicePackageUpdate.featureFour,
          featureFive: servicePackageUpdate.featureFive,
          featureSix: servicePackageUpdate.featureSix,
          featureSeven: servicePackageUpdate.featureSeven,
          featureEight: servicePackageUpdate.featureEight,
          featureNine: servicePackageUpdate.featureNine,
          featureTen: servicePackageUpdate.featureTen,
        },
      };

      const result = await servicePackageCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* serviceTitleCollections */

    app.get("/service-title", async (req, res) => {
      const query = {};
      const cursor = serviceTitleCollections.find(query);
      const serviceTitle = await cursor.toArray();
      res.send(serviceTitle);
    });
    app.get("/service-title/:id", async (req, res) => {
      const query = {};
      const cursor = serviceTitleCollections.find(query);
      const serviceTitle = await cursor.toArray();
      res.send(serviceTitle);
    });

    app.put("/edit-service-title/:id", async (req, res) => {
      const id = req.params.id;
      const updateServiceTitle = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          title: updateServiceTitle.title,
        },
      };

      const result = await serviceTitleCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });





    /* counterSectionCollections  */

    app.get("/counters-section", async (req, res) => {
      const query = {};
      const cursor = counterSectionCollections.find(query);
      const serviceTitle = await cursor.toArray();
      res.send(serviceTitle);
    });
    app.get("/counter-section/:id", async (req, res) => {
      const query = {};
      const cursor = counterSectionCollections.find(query);
      const serviceTitle = await cursor.toArray();
      res.send(serviceTitle);
    });

    app.put("/edit-counter-section/:id", async (req, res) => {
      const id = req.params.id;
      const updateServiceTitle = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          titleOne: updateServiceTitle.titleOne,
          numberOne: updateServiceTitle.numberOne,
          imgOne: updateServiceTitle.imgOne,
          titleTwo: updateServiceTitle.titleTwo,
          numberTwo: updateServiceTitle.numberTwo,
          imgTwo: updateServiceTitle.imgTwo,
          titleThree: updateServiceTitle.titleThree,
          numberThree: updateServiceTitle.numberThree,
          imgThree: updateServiceTitle.imgThree,
          titleFour: updateServiceTitle.titleFour,
          numberFour: updateServiceTitle.numberFour,
          imgFour: updateServiceTitle.imgFour,
        },
      };

      const result = await counterSectionCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });



    /* counterSectionTitleCollections  */

    app.get("/counter-section-title", async (req, res) => {
      const query = {};
      const cursor = counterSectionTitleCollections.find(query);
      const serviceTitle = await cursor.toArray();
      res.send(serviceTitle);
    });
    app.get("/counter-section-title/:id", async (req, res) => {
      const query = {};
      const cursor = counterSectionTitleCollections.find(query);
      const serviceTitle = await cursor.toArray();
      res.send(serviceTitle);
    });

    app.put("/edit-counter-section-title/:id", async (req, res) => {
      const id = req.params.id;
      const updateServiceTitle = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {

          title: updateServiceTitle.title,
          description: updateServiceTitle.description,

        },
      };

      const result = await counterSectionTitleCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /* videoSectionTitleCollections  */

    app.get("/video-section", async (req, res) => {
      const query = {};
      const cursor = videoSectionTitleCollections.find(query);
      const serviceTitle = await cursor.toArray();
      res.send(serviceTitle);
    });
    app.get("/video-section/:id", async (req, res) => {
      const query = {};
      const cursor = videoSectionTitleCollections.find(query);
      const serviceTitle = await cursor.toArray();
      res.send(serviceTitle);
    });

    app.put("/edit-video-section/:id", async (req, res) => {
      const id = req.params.id;
      const updateServiceTitle = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {

          image: updateServiceTitle.image,
          youtube: updateServiceTitle.youtube,

        },
      };

      const result = await videoSectionTitleCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });


    /* stripeKeysCollection */

    app.post('/add-stripe-key', async (req, res) => {
      const stripe = req.body;
      const result = await stripeKeysCollection.insertOne(stripe);
      res.send(result);
    });
    app.get('/stripe-keys', async (req, res) => {
      const query = {};
      const cursor = stripeKeysCollection.find(query);
      const stripe = await cursor.toArray();
      res.send(stripe);
    });
    app.get('/stripe-key/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const stripe = await stripeKeysCollection.findOne(query);
      res.send(stripe);

    });
    app.put("/stripe-key/:id", async (req, res) => {
      const id = req.params.id;
      const stripeEdit = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          stripeKey: stripeEdit.stripeKey,
        },
      };
      const result = await stripeKeysCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });




    


  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Website is Live Now");
});
app.listen(port, () => {
  console.log(`Server is Live Now ${port}`);
});
