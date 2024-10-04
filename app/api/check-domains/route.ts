// app/api/check-domains/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import axios from 'axios';

export async function POST(request: NextRequest) {
    const { userId } = getAuth(request);

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { domains } = await request.json();

        console.log('Original domains:', domains);

        if (!domains || !Array.isArray(domains)) {
            return NextResponse.json(
                { error: 'Domains are required and should be an array.' },
                { status: 400 }
            );
        }

        // 3. Clean the domains by removing numbering and newline characters
        const cleanDomains = domains.flatMap(domainStr => {
            // Step 1: Flatten the array into a single string and remove unwanted characters
            const cleanedString = domainStr
                .replace(/[\[\]"]/g, '');  // Removes [, ], and " characters

            // Step 2: Split the cleaned string by commas to get individual domain names
            return cleanedString.split(',').map((domain: string) => domain.trim());
        }).filter(domain => domain.endsWith('.com')); // Keep only .com domains

        // Strip .com from each domain before sending the request
        const strippedDomains = cleanDomains.map(domain => domain.replace('.com', ''));

        // Initialize variables for processing
        const availableDomains: string[] = [];
        const batchSize = 5;
        const totalRequired = 5;

        // Process domains in batches
        for (let i = 0; i < strippedDomains.length; i += batchSize) {
            const batch = strippedDomains.slice(i, i + batchSize);

            const domainChecks = batch.map(name => ({
                name,
                tld: 'com',  // Specify the TLD separately
            }));

            console.log('Checking domains:', domainChecks);

            const options = {
                method: 'POST',
                url: 'https://domainstatus.p.rapidapi.com/v1/domain/available',
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
                    'X-RapidAPI-Host': 'domainstatus.p.rapidapi.com',
                },
                data: domainChecks,
            };

            try {
                const response = await axios.request(options);
                const data = response.data;
                console.log('RapidAPI response:', data);

                if (data && Array.isArray(data)) {
                    data.forEach((domainResult: any) => {
                        if (domainResult.available && domainResult.tld === 'com') {
                            console.log('Domain to save to Supabase:', domainResult.name);
                            availableDomains.push(`${domainResult.name}.com`);
                            console.log('Total Available domains:', availableDomains);
                        }
                    });
                }

                // Check if we have collected the required number of available domains
                // Remove the break condition to continue processing even if availableDomains is less than totalRequired
                // if (availableDomains.length >= totalRequired) {
                //     // Add available domains to the database
                //     // await addAvailableDomainsToDB(userId, availableDomains);
                //     break;
                // }
            } catch (error: any) {
                console.error('Error checking domains:', error.response?.data || error.message);
                return NextResponse.json(
                    { error: error.response?.data?.error || 'Failed to check domains' },
                    { status: error.response?.status || 500 }
                );
            }
        }

        // After processing all batches, check if we found any available domains
        if (availableDomains.length === 0) {
            console.log('No available domains found after checking:', strippedDomains);
            return NextResponse.json(
                { message: 'No available domains found.' },
                { status: 200 }
            );
        }

        // Return available domains to the client
        return NextResponse.json({ availableDomains }, { status: 200 });
    } catch (error: any) {
        console.error('Error checking domains:', error);
        return NextResponse.json({ error: 'Failed to check domains' }, { status: 500 });
    }
}

// New function to add available domains to the project table
// async function addAvailableDomainsToDB(userId: string, domains: string[]) {
//     // Fetch the numeric userId from your user table
//     const user = await prisma.user.findUnique({
//         where: { user_id: userId },
//         select: { id: true }
//     });

//     if (!user) {
//         throw new Error('User not found');
//     }

//     // Fetch the project ID using the user ID
//     const project = await prisma.project.findUnique({
//         where: { userId: user.id }, // Use the correct unique identifier for the project
//         select: { id: true }
//     });

//     if (!project) {
//         throw new Error('Project not found');
//     }

//     // Add new domains to the existing array
//     await prisma.project.update({
//         where: { id: project.id }, // Use the project ID
//         data: {
//             domains: {
//                 push: domains, // Push new domains into the existing array
//             },
//         },
//     });
// }