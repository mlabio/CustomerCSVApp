using nResultExam_1.EntityFramework;
using nResultExam_1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.SqlClient;
using System.Data.OleDb;
using System.Configuration;

namespace nResultExam_1.Controllers
{
    public class CustomerController : Controller
    {
        // GET: Customer
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetCustomer()
        {
            CustomerDal _oCustomerDal = new CustomerDal();
            List<Customer> ListOfCostumer = _oCustomerDal.customers.ToList();
            return Json(ListOfCostumer, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getData()
        {
            using (CustomerDal _oCustomerDal = new CustomerDal())
            {
                return Json(_oCustomerDal.customers.ToList());
            }
        }

        [HttpPost]
        public JsonResult SaveCustomer(Customer _oCustomer)
        {
            CustomerDal _oCustomerDal = new CustomerDal();
            _oCustomerDal.customers.Add(_oCustomer);
            _oCustomerDal.SaveChanges();

            List<Customer> ListOfCostumer = _oCustomerDal.customers.ToList();
            return Json(ListOfCostumer, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult SaveExcelData(List<Customer> customers)
        {
            bool status = false;
            if(ModelState.IsValid)
            {
                using (CustomerDal _oCustomerDal = new CustomerDal())
                {
                    foreach(var i in customers)
                    {
                        _oCustomerDal.customers.Add(i);
                    }
                    _oCustomerDal.SaveChanges() ;
                    status = true;
                }
            }
            return new JsonResult { Data = new { status = status } };
        }

    }
}