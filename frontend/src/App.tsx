import Playground from './components/Playground/Playground'
import Documentation from './components/Documentation/Documentation'
import Hero from './components/Hero/Hero'
import ToTop from './components/ToTop'
import classes from './App.module.css'
import Toggle from './components/Playground/Toggle'

function App() {

  return (
    <>
      <Toggle />
      <div className={classes.stack}>
        <Hero />
        <Playground />
        <Documentation />
      </div>
      <ToTop />
    </>
  )
}

export default App
