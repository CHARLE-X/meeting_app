// pages/dashboard/index.tsx
'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/app/styles/Dashboard.module.css';
import { FaSearch, FaCalendarAlt, FaEye } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';
import useLogout from '@/app/dashboard/logout/page';
import { useUser } from '@/app/context/UserContext';

interface Meeting {
  id: number;
  name: string;
  date: string;
  templates: string[];
}

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const logout = useLogout();

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user || !user.id) {
        return; // Exit early if user is not authenticated or does not have an ID
      }

      try {
        setLoading(true);
        const response = await fetch(`https://d35d-197-211-53-14.ngrok-free.app/meetings/user/${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch meetings');
        }
        const data = await response.json();
        setMeetings(data.meetings);
        setFilteredMeetings(data.meetings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching meetings:', error);
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [user]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();
    const filtered = meetings.filter(
      (meeting) =>
        meeting.name.toLowerCase().includes(lowerQuery) ||
        meeting.templates.some((template: string) => template.toLowerCase().includes(lowerQuery))
    );
    setFilteredMeetings(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleDateFilter = () => {
    const filtered = meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.date);
      const start = new Date(startDate);
      const end = new Date(endDate);

      return (!startDate || meetingDate >= start) && (!endDate || meetingDate <= end);
    });
    setFilteredMeetings(filtered);
    setCurrentPage(1); // Reset to first page on filter
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMeetings.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredMeetings.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className={styles.menuBar}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search meetings"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className={styles.dateFilter}>
          <div className={styles.calendar}>
            <FaCalendarAlt className={styles.calendarIcon} />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className={styles.calendar}>
            <FaCalendarAlt className={styles.calendarIcon} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <button className={styles.filterButton} onClick={handleDateFilter}>
            Filter
          </button>
        </div>
        <Link href="/dashboard/newmeeting" legacyBehavior>
          <a className={styles.newMeetingButton}>New Meeting</a>
        </Link>
      </div>
      {loading ? (
        <div className={styles.loading}>
          <ImSpinner2 className={styles.spinner} />
          <p>Loading...</p>
        </div>
      ) : currentItems.length === 0 ? (
        <div className={styles.noData}>
          <p>Error 404: No meetings found. Click on "New Meeting" to create a new meeting.</p>
        </div>
      ) : (
        <>
          <table className={styles.meetingsTable}>
            <thead>
              <tr>
                <th>Meeting Name</th>
                <th>Date</th>
                <th>Templates</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((meeting) => (
                <tr key={meeting.id}>
                  <td>{meeting.name}</td>
                  <td>{meeting.date}</td>
                  <td>{meeting.templates.join(', ')}</td>
                  <td>
                    <Link href={`/dashboard/meetingdetails?title=${encodeURIComponent(meeting.name)}&template=${encodeURIComponent(meeting.templates[0])}&fileName=${encodeURIComponent('')}`}>
                      <button className={styles.viewButton}>
                        <FaEye />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={styles.pageButton}
                onClick={() => handlePageChange(i + 1)}
                disabled={currentPage === i + 1}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
