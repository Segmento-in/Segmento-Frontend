import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import ConnectorsClient from './ConnectorsClient';

// Mock dependencies
vi.mock('@/lib/authContext', () => ({
    useAuth: () => ({
        isLoggedIn: true,
        user: { id: 'test-user', email: 'test@example.com' },
    }),
}));

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

// Mock the child components to avoid deep rendering issues in tests
vi.mock('./LocalUploadView', () => ({
    default: () => <div data-testid="local-upload-mock">Local Upload Content Mock</div>,
}));

// We can mock the tabs to avoid heavy rendering, but it's okay to let them shallow render or crash if not mocked, 
// as long as the test focuses on the layout structure. We'll mock one just in case.
vi.mock('@/components/model-lab/tabs/DriveScanTab', () => ({
    default: () => <div>Drive Scan Tab</div>,
}));

describe('ConnectorsClient Layout & Navigation', () => {
    it('does not render the old left sidebar and hero header', () => {
        render(<ConnectorsClient />);

        // The text from the old sidebar
        const sidebarText = screen.queryByText(/Scan cloud storage for PII/i);
        // The old hero header H1
        const heroHeader = screen.queryByRole('heading', { name: 'Data Connectors', level: 1 });

        expect(sidebarText).not.toBeInTheDocument();
        expect(heroHeader).not.toBeInTheDocument();
    });

    describe('File Handlers chip merge', () => {
        it('does not render the standalone switcher element', () => {
            render(<ConnectorsClient />);
            
            // The old switcher wrapper was a div containing specifically "File Handlers" and "Connectors" buttons.
            // Since the old top navbar is completely removed, its wrapper shouldn't exist.
            // In RED state, this will fail because the old switcher block is still there.
            const fileHandlersLogo = screen.queryByTestId('local-file-uploader-logo');
            expect(fileHandlersLogo).not.toBeInTheDocument();
        });

        it('renders File Handlers as the 5th chip in the filter row and clicking it switches to local-upload view', () => {
            render(<ConnectorsClient />);
            
            // The 5 pills in the bucket: All, Cloud, Database, Social, File Handlers
            const allPills = [
                screen.getByRole('button', { name: /^All$/i }),
                screen.getByRole('button', { name: /^Cloud$/i }),
                screen.getByRole('button', { name: /^Database$/i }),
                screen.getByRole('button', { name: /^Social$/i }),
                screen.getByRole('button', { name: /^File Handlers$/i })
            ];
            
            expect(allPills[4]).toBeInTheDocument();
            
            // Click File Handlers
            fireEvent.click(allPills[4]);
            
            // The Local upload view container should now have 'flex' and grid view should have 'hidden'
            const localView = screen.getByTestId('local-upload-mock').closest('div.flex-col');
            expect(localView).toHaveClass('flex');
        });

        it('clicking any of the other 4 chips while in local-upload view returns to the connectors grid', () => {
            render(<ConnectorsClient />);
            const fileHandlersBtn = screen.getByRole('button', { name: /^File Handlers$/i });
            const allBtn = screen.getByRole('button', { name: /^All$/i });
            
            // First enter local-upload view
            fireEvent.click(fileHandlersBtn);
            
            let gridView = screen.getByText(/Select a Connector/i).closest('div.flex-col');
            expect(gridView).toHaveClass('hidden');

            // Now click 'All'
            fireEvent.click(allBtn);
            
            // Grid should be visible again
            expect(gridView).toHaveClass('flex');
        });
    });

    // ─── TICKET 3 — Connector Filter Bucket pill row ──────────────────────────

    // T3-1: pill row renders with all 4 pills, all 14 connectors visible by default
    it('shows filter pill row (All/Cloud/Database/Social) and all 14 connectors on initial render', () => {
        render(<ConnectorsClient />);

        // All 4 filter pills must be present
        expect(screen.getByRole('button', { name: /^All$/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /^Cloud$/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /^Database$/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /^Social$/i })).toBeInTheDocument();

        // Default: all 14 connector cards are visible
        // Each ConnectorCard renders exactly one "View Connector" button
        expect(screen.getAllByRole('button', { name: /View Connector/i })).toHaveLength(14);
    });

    // T3-2: Cloud filter — exactly 5 connectors (drive, s3, azure, gcs, glue)
    it('clicking Cloud filter shows exactly 5 connectors', () => {
        render(<ConnectorsClient />);
        fireEvent.click(screen.getByRole('button', { name: /^Cloud$/i }));
        expect(screen.getAllByRole('button', { name: /View Connector/i })).toHaveLength(5);
        // Spot-check a few names that must be visible
        expect(screen.getByText('Google Drive')).toBeInTheDocument();
        expect(screen.getByText('AWS Glue')).toBeInTheDocument();
        // A database connector must NOT appear
        expect(screen.queryByText('MongoDB')).not.toBeInTheDocument();
    });

    // T3-3: Database filter — exactly 5 connectors (database, aws-rds, dynamodb, mongodb, mariadb)
    it('clicking Database filter shows exactly 5 connectors', () => {
        render(<ConnectorsClient />);
        fireEvent.click(screen.getByRole('button', { name: /^Database$/i }));
        expect(screen.getAllByRole('button', { name: /View Connector/i })).toHaveLength(5);
        expect(screen.getByText('MongoDB')).toBeInTheDocument();
        expect(screen.getByText('MariaDB')).toBeInTheDocument();
        // A cloud connector must NOT appear
        expect(screen.queryByText('Google Drive')).not.toBeInTheDocument();
    });

    // T3-4: Social filter — exactly 4 connectors (slack, gmail, zendesk, salesforce)
    it('clicking Social filter shows exactly 4 connectors', () => {
        render(<ConnectorsClient />);
        fireEvent.click(screen.getByRole('button', { name: /^Social$/i }));
        expect(screen.getAllByRole('button', { name: /View Connector/i })).toHaveLength(4);
        expect(screen.getByText('Slack')).toBeInTheDocument();
        expect(screen.getByText('Salesforce')).toBeInTheDocument();
        // A database connector must NOT appear
        expect(screen.queryByText('DynamoDB')).not.toBeInTheDocument();
    });

    // T3-5: clicking All after a filter restores all 14 connectors
    it('clicking All after filtering restores all 14 connectors', () => {
        render(<ConnectorsClient />);
        // Filter down first
        fireEvent.click(screen.getByRole('button', { name: /^Cloud$/i }));
        expect(screen.getAllByRole('button', { name: /View Connector/i })).toHaveLength(5);
        // Then reset
        fireEvent.click(screen.getByRole('button', { name: /^All$/i }));
        expect(screen.getAllByRole('button', { name: /View Connector/i })).toHaveLength(14);
    });
});

describe('ConnectorsClient Dark Mode', () => {
    // Legacy dark mode tests removed

    it('applies inverted CTA styling to the active filter pill', () => {
        render(<ConnectorsClient />);
        // By default 'All' filter is active
        const allPill = screen.getByRole('button', { name: /^All$/i });
        expect(allPill).toHaveClass('dark:bg-white', 'dark:text-slate-900', 'dark:border-white');
    });

    it('applies dark mode classes to inactive filter pills', () => {
        render(<ConnectorsClient />);
        // 'Cloud' filter is inactive by default
        const cloudPill = screen.getByRole('button', { name: /^Cloud$/i });
        expect(cloudPill).toHaveClass('dark:bg-slate-900', 'dark:text-slate-400', 'dark:border-slate-800');
    });

    it('applies dark mode classes to the Connector Cards', () => {
        render(<ConnectorsClient />);
        // Get the first "View Connector" button, which is the CTA inside the card
        const firstCta = screen.getAllByRole('button', { name: /View Connector/i })[0];
        
        // Assert CTA inversion
        expect(firstCta).toHaveClass('dark:bg-white', 'dark:text-slate-900', 'dark:border-white');

        // Check the card wrapper
        const cardWrapper = firstCta.closest('div.group');
        expect(cardWrapper).toHaveClass('dark:bg-slate-900', 'dark:border-slate-800');
    });

    it('applies dark mode classes to the Auth Panel elements', () => {
        render(<ConnectorsClient />);
        
        // Open the Auth Panel by clicking a connector
        const driveCta = screen.getAllByRole('button', { name: /View Connector/i })[0];
        fireEvent.click(driveCta);

        // 1. Auth Grid Wrapper (contains the grid-cols-1 lg:grid-cols-2)
        // It's the parent of the max-w-7xl grid, so we can find the Back to Connectors button and go up
        const backBtn = screen.getByRole('button', { name: /Back to Connectors/i });
        const authGridWrapper = backBtn.closest('div.flex-col.border-b');
        expect(authGridWrapper).toHaveClass('dark:bg-slate-900', 'dark:border-slate-800');

        // 2. Back Button
        expect(backBtn).toHaveClass('dark:text-slate-400', 'dark:hover:text-white');

        // 3. Not Connected Badge
        const notConnectedBadge = screen.getByText(/Not Connected/i).closest('div.border');
        expect(notConnectedBadge).toHaveClass('dark:bg-slate-800', 'dark:text-slate-400', 'dark:border-slate-800');
        
        // 4. Hero Title (Connector)
        const heroTitle = screen.getByRole('heading', { name: 'Connector', level: 1 });
        expect(heroTitle).toHaveClass('dark:text-white');
    });
});
