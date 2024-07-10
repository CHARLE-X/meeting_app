'use client';
import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaEye } from "react-icons/fa";
import styles from "@/app/styles/TemplateDashboard.module.css";
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";
import { API_ENDPOINTS } from '@/constant/static';

interface Template {
  template_id: number;
  template_name: string;
  question_count: number;
}

const TemplateDashboard: React.FC = () => {
  const { user } = useUser();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const fetchTemplates = async () => {
    if (!user || typeof user.id !== "number" || isNaN(user.id)) {
      console.error("User ID is not a valid integer:", user);
      return;
    }

    try {
      console.log("Fetching templates for user ID:", user.id);
      const response = await fetch(`${API_ENDPOINTS.GET_TEMPLATES}?user_id=${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420',
        },
      });

      console.log({ template_response: response });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch templates:', errorText);
        throw new Error(`Failed to fetch templates: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched templates:", data);
      // Sort templates by template_id in descending order
      const sortedTemplates = Array.isArray(data) ? data.sort((a: Template, b: Template) => b.template_id - a.template_id) : [data];
      setTemplates(sortedTemplates);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  useEffect(() => {
    console.log("User object:", user);
    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTemplates = templates.filter((template) =>
    template.template_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTemplates.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Templates</h1>
      <div className={styles.menuBar}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search Templates"
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <FaSearch className={styles.searchIcon} />
        </div>
        <Link href="/dashboard/questiontemplate/newtemplate">
          <button className={styles.newTemplateButton}>New Template</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Template Name</th>
            <th>Questions</th>
            <th>Edit</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((template) => (
            <tr key={template.template_id}>
              <td>{template.template_name}</td>
              <td>{template.question_count}</td>
              <td>
                <Link href={`/dashboard/questiontemplate/edittemplate?template_id=${template.template_id}`}>
                  <FaEdit className={styles.icon} />
                </Link>
              </td>
              <td>
                <Link href={`/dashboard/questiontemplate/viewtemplate?template_id=${template.template_id}`}>
                  <FaEye className={styles.icon} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(filteredTemplates.length / itemsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={styles.pageButton}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateDashboard;
