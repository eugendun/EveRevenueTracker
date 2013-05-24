using System;
using System.Data.Entity;

namespace MvcMovie.Models
{
    public class Article
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string author { get; set; }
    }

    public class ArticleDBContext : DbContext
    {
        public DbSet<Article> Articles { get; set; }
    }
}
