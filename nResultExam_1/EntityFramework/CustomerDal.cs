using nResultExam_1.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace nResultExam_1.EntityFramework
{
    public class CustomerDal : DbContext
    {
        public CustomerDal() : base("dbconnection") { }

        public DbSet<Customer> customers {get; set;}

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer>().ToTable("Customer");
            modelBuilder.Entity<Customer>().HasKey(x => x.CustomerId);
        }
    }
}