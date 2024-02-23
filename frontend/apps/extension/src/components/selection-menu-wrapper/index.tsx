/**
 * selection 操作菜单
 */
import { useConversationContext } from '@xm/context';
import SelectionMenu from '../selection-menu';
import { useSelectionSwitch } from '@xm/hooks';

interface SelectionMenuProps {
    openMain: () => any;
}

const SelectionMenuWrapper: React.FC<SelectionMenuProps> = (props) => {
    const { conversationState } = useConversationContext();
    const [selectionSwitch] = useSelectionSwitch();
    if (!conversationState.selectFlag || !selectionSwitch) {
        return null;
    }

    return <SelectionMenu {...props} />;
};

export default SelectionMenuWrapper;
