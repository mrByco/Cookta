using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Test.Cooktapi
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {
            Assert.IsTrue(true);
        }
        [TestMethod]
        public void TestMethod2()
        {
            Assert.AreEqual(true, false);
        }
        [TestMethod]
        public void TestMethod3()
        {
            Assert.IsTrue(true);
        }
    }
}
