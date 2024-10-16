//import { FreeToolsList } from '../../components/free-tools/free-tools-list';
"use client"
import React from 'react';
import PageWrapper from '../../components/wrapper/page-wrapper';
import { FreeToolsList } from '../../components/free-tools/free-tools-list';
export default function FreeToolsPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Free Social Media Marketing Tools</h1>
        <p className="mt-4 text-xl text-gray-600">
            Supercharge your Social Media marketing strategy with our free tools
          </p>
        <FreeToolsList />
      </div>
    </PageWrapper>
  );
}

