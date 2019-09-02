using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml.Media.Animation;
using Kukta.Annotations;

namespace Kukta.UWPLayer
{
    internal class NavigationHistory : List<NavigationHistoryItem>, INotifyPropertyChanged
    {
        private int m_Position;

        public int Position
        {
            get => m_Position;
            set
            {
                if (value == m_Position) return;
                m_Position = value;
                OnPropertyChanged();
                OnPropertyChanged(nameof(BackEnabled));
            }
        }

        private const int MaxHistoryLenght = 30;

        public new void Add(NavigationHistoryItem item)
        {
            if (Position < Count - 1)
            {
                RemoveRange(Position + 1, Count - Position - 1);
            }
            base.Add(item);
            if (Count > MaxHistoryLenght)
            {
                RemoveAt(0);
            }
            Position = Count - 1;
        }

        /// <summary>
        /// Returns the current position item is posible
        /// </summary>
        public NavigationHistoryItem Back()
        {
            if (!BackEnabled) return null;
            Position--;
            return base[Position];
        }

        public bool BackEnabled => Position > 0;

        public event PropertyChangedEventHandler PropertyChanged;

        [NotifyPropertyChangedInvocator]
        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
