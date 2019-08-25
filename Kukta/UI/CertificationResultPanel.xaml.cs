using Cooktapi.Food.Certificate;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The User Control item template is documented at https://go.microsoft.com/fwlink/?LinkId=234236

namespace Kukta.UI
{
    public sealed partial class CertificationResultPanel : UserControl, INotifyPropertyChanged
    {
        public CertificationResultPanel()
        {
            this.InitializeComponent();
        }

        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string name)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }

        private IFoodCertificationResult m_Report;
        public IFoodCertificationResult Report
        {
            get => m_Report;
            set
            {
                m_Report = value;
                IsPending = m_Report is PendingCertifiacte;
                OnPropertyChanged("Report");
            }
        }
        private bool m_IsPending;
        public bool IsPending
        {
            get => m_IsPending;
            set
            {
                m_IsPending = value;
                OnPropertyChanged("IsPending");
            }
        }


    }
}
