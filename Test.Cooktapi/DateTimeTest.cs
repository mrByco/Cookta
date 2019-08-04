using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;
using Cooktapi.Extensions;

namespace Test.Cooktapi
{
    [TestClass]
    public class DateTimeTest
    {
        [TestMethod]
        public void CutToDateTest()
        {
            DateTime dateTime = new DateTime(2019, 08, 4, 9, 2, 35);
            var cutted = dateTime.CutToDay();
            Assert.IsTrue(cutted.Millisecond == 0);
            Assert.IsTrue(cutted.Second == 0);
            Assert.IsTrue(cutted.Minute == 0);
            Assert.IsTrue(cutted.Hour == 0);
        }
        [TestMethod]
        public void StartOfWeekTest()
        {
            DateTime dateTime = new DateTime(2019, 08, 4, 9, 2, 35);
            var startDate = dateTime.StartOfWeek(DayOfWeek.Monday);
            Assert.AreEqual(startDate, new DateTime(2019, 07, 29, 0, 0, 0));
        }
        [TestMethod]
        public void DayIndexInWeek()
        {
            DateTime dateTime = new DateTime(2019, 08, 4, 9, 2, 35);

            int index = dateTime.DayIndexInWeek(DayOfWeek.Monday);

            Assert.IsTrue(index == 6);
        }
    }
}
