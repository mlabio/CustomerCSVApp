namespace nResultExam_1.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Customer",
                c => new
                    {
                        CustomerId = c.Int(nullable: false, identity: true),
                        Gender = c.String(),
                        Occupation = c.String(),
                        Company = c.String(),
                        GivenName = c.String(),
                        MiddleInitial = c.String(),
                        Surname = c.String(),
                        BloodType = c.String(),
                        EmailAddress = c.String(),
                        Title = c.String(),
                    })
                .PrimaryKey(t => t.CustomerId);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Customer");
        }
    }
}
