// pages/dashboard/index.tsx
'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/app/styles/Dashboard.module.css';
import { FaSearch, FaCalendarAlt, FaEye } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';
import useLogout from '@/app/dashboard/logout/page';
import { useUser } from '@/app/context/UserContext';
import { API_ENDPOINTS } from '@/constant/static';

interface Meeting {
  id: number;
  name: string;
  created_at: string;
  template_name: string;
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
        const response = await fetch(`${API_ENDPOINTS.GET_MEETING}${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch meetings');
        }
        const data = await response.json();

        // Sort meetings by created_at in descending order
        const sortedMeetings = data.meetings.sort((a: Meeting, b: Meeting) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setMeetings(sortedMeetings);
        setFilteredMeetings(sortedMeetings);
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
        meeting.template_name.toLowerCase().includes(lowerQuery)
    );
    setFilteredMeetings(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleDateFilter = () => {
    const filtered = meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.created_at);
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
          <p>No meetings found. Click on &quot;New Meeting&quot; to create a new meeting.</p>
        </div>
      ) : (
        <>
          <table className={styles.meetingsTable}>
            <thead>
              <tr>
                <th>Meeting Name</th>
                <th>Date</th>
                <th>Template</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((meeting) => (
                <tr key={meeting.id}>
                  <td>{meeting.name}</td>
                  <td>{new Date(meeting.created_at).toLocaleDateString()}</td>
                  <td>{meeting.template_name}</td>
                  <td>
                    {user && user.id && (
                      <Link href={`/dashboard/viewmeetings?user_id=${user.id}&meeting_id=${meeting.id}`}>
                        <button className={styles.viewButton}>
                          <FaEye />
                        </button>
                      </Link>
                    )}
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
