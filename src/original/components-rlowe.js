class Options extends Component {
    render(props, state) {
        console.log('Options: options.length' + this.props.options.length);
        inspect(this.props.options);
        return this.props.options.map((option, i) => {
            var isSelected = (option.value === this.props.selected) ? 'selected' : null;
            return <option selected={isSelected} value={option.value}>{option.label}</option>
        });
    }
}
class Select extends Component {
    renderOptions(options=[], selected) {
        return options.map((option, i) => {
            var isSelected = option.value === selected ? 'selected' : null;
            return <option selected={isSelected} value={option.value}>{option.label}</option>
        });
    }
    handleChange(e){}
    render(props, state) {
        return (
            <div className='form-group'>
                <label className='col-sm-5 control-label' for={this.props.name + 'Select'}>
                    {this.props.label}
                </label>
                <div class='col-sm-7'>
                    <select onChange={this.handleChange.bind(this)} className='form-control input-sm'>
                        {this.renderOptions(state.options, state.selected)}
                    </select>
                </div>
            </div>
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
        this.props.store.dispatch(actions.setAssembly(e.target.value));
    }
}

class Color extends Select {
    componentWillMount(){
        this.setStateFromStore()
        this.props.store.subscribe(() => {
            this.setStateFromStore();
        });
    }
    setStateFromStore(){
        var state = this.props.store.getState();
        this.setState({
            options: state.colorOptions,
            selected: state.color
        });
    }
    handleChange(e){
        console.log('Color: color=' + e.target.value);
        this.props.store.dispatch(actions.setColor(e.target.value));
    }
}

class Style extends Select {
    componentWillMount(){
        this.setStateFromStore()
        this.props.store.subscribe(() => {
            this.setStateFromStore();
        });
    }
    setStateFromStore(){
        var state = this.props.store.getState();
        this.setState({
            options: state.styleOptions,
            selected: state.style
        });
    }
    handleChange(e){
        console.log('Style: style=' + e.target.value);
        this.props.store.dispatch(actions.setStyle(e.target.value));
    }
}