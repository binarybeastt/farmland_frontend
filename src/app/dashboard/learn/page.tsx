"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { SideBar } from "../../../components/Dashboard/sections/SideBar";
import { Header } from "../../../components/Dashboard/sections/Header";
import styles from "./learn.module.css";

// Mock data for educational resources
const learningResources = [
  {
    id: 1,
    title: "Introduction to Sustainable Farming",
    category: "Basics",
    description: "Learn the fundamental principles of sustainable farming and how it benefits the environment and communities.",
    image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    difficulty: "Beginner",
    readTime: "10 min",
  },
  {
    id: 2,
    title: "Crop Rotation Techniques",
    category: "Techniques",
    description: "Discover effective crop rotation strategies to improve soil health and maximize yield while reducing pests and diseases.",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    difficulty: "Intermediate",
    readTime: "15 min",
  },
  {
    id: 3,
    title: "Water Conservation Methods",
    category: "Sustainability",
    description: "Explore innovative techniques for water conservation in agriculture that reduce waste and improve efficiency.",
    image: "https://images.unsplash.com/photo-1439127989242-c3749a012eac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    difficulty: "Intermediate",
    readTime: "12 min",
  },
  {
    id: 4,
    title: "Organic Pest Control",
    category: "Techniques",
    description: "Learn natural ways to control pests without harmful chemicals, protecting your crops and the environment.",
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    difficulty: "Intermediate",
    readTime: "18 min",
  },
  {
    id: 5,
    title: "Soil Health and Management",
    category: "Basics",
    description: "Understand the importance of soil health and learn techniques to build and maintain fertile, productive soil.",
    image: "https://images.unsplash.com/photo-1592989988366-042e27a96fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    difficulty: "Beginner",
    readTime: "8 min",
  },
  {
    id: 6,
    title: "Smart Farming Technologies",
    category: "Innovation",
    description: "Explore how modern technology is revolutionizing agriculture through sensors, drones, and data analytics.",
    image: "https://images.unsplash.com/photo-1597733153203-a54d0fbc47de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    difficulty: "Advanced",
    readTime: "20 min",
  },
  {
    id: 7,
    title: "Climate-Resilient Farming",
    category: "Sustainability",
    description: "Learn strategies to adapt your farming practices to climate change and build resilience against extreme weather events.",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    difficulty: "Advanced",
    readTime: "16 min",
  },
  {
    id: 8,
    title: "Harvesting Best Practices",
    category: "Techniques",
    description: "Discover optimal harvesting techniques to maximize yield, quality, and shelf life of your agricultural products.",
    image: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    difficulty: "Intermediate",
    readTime: "14 min",
  },
  {
    id: 9,
    title: "Understanding Agricultural Markets",
    category: "Business",
    description: "Learn how agricultural markets work and strategies to maximize your profit while ensuring sustainable practices.",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    difficulty: "Intermediate",
    readTime: "13 min",
  },
];

// Extract unique categories
const categories = ["All", ...new Set(learningResources.map(resource => resource.category))];

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter resources based on selected category and search query
  const filteredResources = learningResources.filter(resource => {
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ProtectedRoute>
      <div className="dashboard-subpage">
        <SideBar activeItem="learn" />
        <main>
          <Header pageTitle="Learn" />
          <div className={styles.contentContainer}>
            <div className={styles.headerActions}>
              <h2 className={styles.mainHeading}>Expand Your Farming Knowledge</h2>
            </div>
            
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search for learning resources..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className={styles.categorySelector}>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`${styles.categoryButton} ${selectedCategory === category ? styles.categoryButtonActive : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {filteredResources.length > 0 ? (
              <div className={styles.cardsGrid}>
                {filteredResources.map((resource) => (
                  <div key={resource.id} className={styles.resourceCard}>
                    <div className={styles.resourceImageContainer}>
                      <img 
                        src={resource.image} 
                        alt={resource.title} 
                        className={styles.resourceImage}
                      />
                    </div>
                    <div className={styles.resourceContent}>
                      <div className={styles.resourceTitleRow}>
                        <h3 className={styles.resourceTitle}>{resource.title}</h3>
                        <div className={styles.resourceCategory}>
                          {resource.category}
                        </div>
                      </div>
                      <p className={styles.resourceDescription}>
                        {resource.description}
                      </p>
                      <div className={styles.resourceFooter}>
                        <Link href={`/dashboard/learn/${resource.id}`} className={styles.viewResourceButton}>
                          Read Article
                        </Link>
                        <span className={styles.resourceMeta}>
                          {resource.difficulty} • {resource.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p>No resources found matching your criteria. Try changing your search or category filter.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 