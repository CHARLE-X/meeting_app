'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiAirplay } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { BsQuestionCircle } from "react-icons/bs";
import useLogout from '@/app/dashboard/logout/page';
import styles from '../styles/Layout.module.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const logout = useLogout();
    const isActive = (path: string) => pathname === path;
    
    
    return (
        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <Link href="/dashboard" legacyBehavior>
              <a className={isActive('/dashboard') || isActive('/dashboard/newmeeting') || isActive('/dashboard/meetingdetails') || isActive('/dashboard/answers') || isActive('/dashboard/viewmeetings')|| isActive('/dashboard/editmeeting')? styles.active : ''}>
                <FiAirplay className={styles.icon} />
                Meetings
              </a>
            </Link>
            <Link href="/dashboard/questiontemplate" legacyBehavior>
              <a className={isActive('/dashboard/questiontemplate') || isActive('/dashboard/questiontemplate/newtemplate') || isActive('/dashboard/questiontemplate/viewtemplate') || isActive('/dashboard/questiontemplate/edittemplate') ? styles.active : ''}>
              <BsQuestionCircle className={styles.icon} />
                Question Templates
              </a>
            </Link>
            <Link href="/dashboard/settings" legacyBehavior>
              <a className={isActive('/dashboard/settings') ? styles.active : ''}>
                <IoSettingsOutline className={styles.icon} />
                Settings
              </a>
            </Link>
            <a onClick={logout} className={styles.logout}>
                <IoIosLogOut className={styles.icon} />
                Logout
            </a>
          </aside>
          <main className={styles.main}>
            {children}
          </main>
        </div>
      );
    };
    
export default Layout;
