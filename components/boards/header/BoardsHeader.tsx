import CreateButton from "@/components/buttons/CreateButton"
import TabNavigation from "@/components/boards/tabs/TabNavigation"

interface BoardsHeaderProps {
    tabs: string[];
    selectedTab: string;
    onTabChange: (tab: string) => void;
}

const BoardsHeader = ({ tabs, selectedTab, onTabChange }: BoardsHeaderProps) => {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your saved ideas</h2>
            
            <TabNavigation 
                tabs={tabs}
                selectedTab={selectedTab}
                onTabChange={onTabChange}
            />
           
        </div>
    )
}

export default BoardsHeader