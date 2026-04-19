/**
 * ======================================================================================
 * COMPONENT: Premium UI Skeleton Library
 * ======================================================================================
 * Delivers structural wireframes during asynchronous data fetching.
 * 
 * Features:
 * 1. Visual Stability: Prevents Cumulative Layout Shift (CLS) during API hydration.
 * 2. Contextual Shapes: Provides specialized loaders for Data Tables, Cards, and Mobile Views.
 * 3. Brand Consistency: Employs the 'Stitch' glassmorphism aesthetic even in loading states.
 * ======================================================================================
 */
"use client";

import React from "react";

/**
 * Premium Skeleton Loaders for LoadFlow
 * 
 * Provides ghost placeholders for different dashboard components
 * to maintain visual stability during data fetching.
 */

export const CardSkeleton = () => (
  <div className="glass-card-stitch p-4 rounded-4 position-relative overflow-hidden h-100 d-flex flex-column border border-white border-opacity-10 shadow-lg">
    <div className="skeleton mb-4" style={{ width: '60px', height: '12px', opacity: 0.3 }}></div>
    <div className="d-flex align-items-end justify-content-between mt-auto">
      <div className="skeleton" style={{ width: '80px', height: '48px', opacity: 0.5 }}></div>
      <div className="skeleton rounded-circle" style={{ width: '36px', height: '36px', opacity: 0.2 }}></div>
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="border-bottom-subtle" style={{ height: '70px' }}>
    <td className="px-4 py-3">
      <div className="d-flex align-items-center gap-3">
        <div className="skeleton rounded-3" style={{ width: '36px', height: '36px', opacity: 0.2 }}></div>
        <div className="d-flex flex-column gap-2">
          <div className="skeleton" style={{ width: '80px', height: '14px', opacity: 0.4 }}></div>
          <div className="skeleton" style={{ width: '40px', height: '10px', opacity: 0.2 }}></div>
        </div>
      </div>
    </td>
    <td className="py-3 px-4">
      <div className="d-flex flex-column gap-2">
        <div className="skeleton" style={{ width: '120px', height: '14px', opacity: 0.4 }}></div>
        <div className="skeleton" style={{ width: '60px', height: '10px', opacity: 0.2 }}></div>
      </div>
    </td>
    <td className="py-3 px-4">
      <div className="d-flex flex-column gap-2">
        <div className="skeleton" style={{ width: '120px', height: '14px', opacity: 0.4 }}></div>
        <div className="skeleton" style={{ width: '60px', height: '10px', opacity: 0.2 }}></div>
      </div>
    </td>
    <td className="py-3 px-4 text-center">
      <div className="d-flex justify-content-center">
        <div className="skeleton rounded-circle" style={{ width: '32px', height: '32px', opacity: 0.2 }}></div>
      </div>
    </td>
    <td className="py-3 px-4 text-center">
      <div className="d-flex justify-content-center">
        <div className="skeleton rounded-pill" style={{ width: '80px', height: '24px', opacity: 0.3 }}></div>
      </div>
    </td>
    <td className="px-4 text-end">
      <div className="skeleton rounded-3 ms-auto" style={{ width: '60px', height: '32px', opacity: 0.2 }}></div>
    </td>
  </tr>
);

export const MobileCardSkeleton = () => (
  <div className="glass-card-stitch rounded-4 p-4 mb-4 border border-white border-opacity-10 shadow-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
    <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-white border-opacity-5">
      <div className="d-flex align-items-center gap-3">
        <div className="skeleton rounded-3" style={{ width: '40px', height: '40px', opacity: 0.2 }}></div>
        <div className="d-flex flex-column gap-2">
          <div className="skeleton" style={{ width: '60px', height: '18px', opacity: 0.4 }}></div>
          <div className="skeleton" style={{ width: '80px', height: '10px', opacity: 0.2 }}></div>
        </div>
      </div>
      <div className="skeleton rounded-pill" style={{ width: '70px', height: '24px', opacity: 0.3 }}></div>
    </div>
    <div className="d-flex flex-column gap-4 mb-4">
      <div className="d-flex gap-3">
        <div className="skeleton rounded-circle" style={{ width: '24px', height: '24px', opacity: 0.2 }}></div>
        <div className="skeleton flex-grow-1" style={{ height: '40px', opacity: 0.3 }}></div>
      </div>
      <div className="d-flex gap-3">
        <div className="skeleton rounded-circle" style={{ width: '24px', height: '24px', opacity: 0.2 }}></div>
        <div className="skeleton flex-grow-1" style={{ height: '40px', opacity: 0.3 }}></div>
      </div>
    </div>
    <div className="skeleton rounded-3 w-100" style={{ height: '48px', opacity: 0.4 }}></div>
  </div>
);
