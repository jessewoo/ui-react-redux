import { h, Component } from 'preact';
import * as actions from '../actions/actions.js';
import { inspect } from "../util.js";


// TODO: Break up into different files
class Header extends Component {
    render() {
        const store = this.props.store;
        const storeState = store.getState();
        console.log("------------ HEADER SET -------------");
        console.log(storeState);
        return (
            <div>
                <h1>{storeState.pdbId}</h1>
                <h4>{storeState.structureTitle}</h4>
            </div>
        );
    }
}

// Display Options Panel
class DisplayOptions extends Component {
    render() {
        const store = this.props.store;
        const storeState = store.getState();
        console.log("------------ DISPLAY OPTIONS -------------");
        console.log(storeState);

        // Uses the SelectGroup class to generate dropdown selection
        return (
            <div className='form-horizontal'>
                <SelectGroup
                    label='Assembly'
                    name='assembly'
                    options={storeState.assemblyOptions}
                    selected={storeState.assembly}
                    onChange={store.dispatch}
                    action={actions.setAssembly}/>
                <SelectGroup
                    label='Color'
                    name='color'
                    options={storeState.colorOptions}
                    selected={storeState.color}
                    onChange={store.dispatch}
                    action={actions.setColor}/>
                <SelectGroup
                    label='Style'
                    name='style'
                    options={storeState.styleOptions}
                    selected={storeState.style}
                    onChange={store.dispatch}
                    action={actions.setStyle}/>
            </div>
        );
    }
}

// A Select Group from Display Options
// TODO: Programatically subscribe to updates to NGL
class SelectGroup extends Component {
    // Action Creator
    handleChange(e) {
        const { onChange, action } = this.props;
        onChange(action(e.target.value));
    }
    render() {
        // Arguments supplied by SelectGroup component
        const { label, name, options, selected } = this.props;
        // Push options into an array
        const optionsList = [];

        console.log('***** ' + label + ' selected: ' + selected + ' ******');
        console.log(options);

        // Loop thru each Options
        options.forEach((option) => {
            optionsList.push(
                <Option
                    option={option}
                    selected={selected}
                />
            );
        });

        return (
            <div className='form-group'>
                <label className='col-sm-5 control-label' for={name + 'Select'}>
                    {label}
                </label>
                <div class='col-sm-7'>
                    <select onChange={this.handleChange.bind(this)} className='form-control input-sm'>
                        {optionsList}
                    </select>
                </div>
            </div>
        );
    }
}

// List of Options from Select Group
class Option extends Component {
    render() {
        const { option, selected } = this.props;
        console.log('++++++ Selected: ' + selected + ' ++++++');
        // Ternary operator
        const isSelected = (option.value === selected) ? 'selected' : null;
        return (
            <option selected={isSelected} value={option.value}>
                {option.label}
            </option>
        );
    }
}

export { Header, DisplayOptions };

