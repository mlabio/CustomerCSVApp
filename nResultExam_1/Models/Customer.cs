﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace nResultExam_1.Models
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public string Gender { get; set; }
        public string Occupation { get; set; }
        public string Company { get; set; }
        public string GivenName { get; set; }
        public string MiddleInitial { get; set; }
        public string Surname { get; set; }
        public string BloodType { get; set; }
        public string EmailAddress { get; set; }
        public string Title { get; set; }
    }
}