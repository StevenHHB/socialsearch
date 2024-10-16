import { FindYourSub } from '../../../components/free-tools/find-your-sub';
import PageWrapper from "../../../components/wrapper/page-wrapper";
import React from 'react';

export default function FindYourSubPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">FindYourSub</h1>
        <FindYourSub />
      </div>
    </PageWrapper>
  );
}