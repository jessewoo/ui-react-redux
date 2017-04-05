import { h, Component } from 'preact';

import { setAssembly, setAssemblyOptions, setStructure } from "./actions.js";


class Select extends Component {
    renderOptions(options=[], selected) {
        return (
            options.map((option, i) => {
                var isSelected = option.value === selected ? "selected" : null;
                return <option selected={isSelected} value={option.value}>{option.label}</option>
            })
        );
    }
    handleChange(e){}
    render(props, state) {
        return (
            <select
                style={props.style}
                onChange={this.handleChange.bind(this)}>
                    {this.renderOptions(
                        state.options,
                        state.selected)
                    }
            </select>
        );
    }
}


class Assembly extends Select {
    componentWillMount(){
        this.setStateFromStore()
        this.props.store.subscribe(() => {
            this.setStateFromStore();
        });
    }
    setStateFromStore(){
        var state = this.props.store.getState();
        this.setState({
            options: state.assemblyOptions,
            selected: state.assembly
        });
    }
    handleChange(e){
        this.props.store.dispatch(setAssembly(e.target.value));
    }
}



export {
    Select,
    Assembly
};