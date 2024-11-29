<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>NTFY Viewer</title>
	<meta name="description" content="NTFY Viewer" />
</svelte:head>

<a
  class="flex justify-center items-center w-full h-full hover:bg-lime-200/50 hover:no-underline"
  href={data.prevDayLink}
>
  <div class="text-7xl text-slate-600">
    ←
  </div>
</a>

<div class="h-full flex flex-initial flex-col">
  <div class="h-full meals-list overflow-scroll">

    <div>
      <h1>Jadłospis {data.date}</h1>
    </div>

    <div>
      {#each Object.values(data.dishData) as mealOptions, index}
        <h2 id={data.mealNames[index]}>
          {data.mealNames[index]}
        </h2>
        <table class="meals">
          <thead>
            <tr>
              <th>Nazwa</th>
              <th></th>
              <th class="meal-numerical">Ocena</th>
              <th class="meal-numerical">Białko</th>
              <th class="meal-numerical">Tłuszcze nas.</th>
            </tr>
          </thead>
          <tbody>
            {#each mealOptions as meal}
              <tr>
                <td class="meal-name">
                  {meal.name}
                </td>
                <td class="meal-image">
                  <a href={meal.link} target="_blank" rel="noopener noreferrer">
                    <img
                      alt={meal.name.substr(0, meal.name.indexOf(' '))}
                      class="img-main"
                      src={meal.imgSquareLink}
                    />
                    <img
                      alt={meal.name.substr(0, meal.name.indexOf(' '))}
                      class="img-alternative"
                      src={meal.imgRealLink}
                    />
                  </a>
                </td>
                <td class="meal-numerical">
                  <div class="meal-numerical-color" style={`background: ${meal.rating.color}`}>
                    {meal.rating.value.toFixed(2)}
                  </div>
                </td>
                <td class="meal-numerical">
                  <div class="meal-numerical-color" style={`background: ${meal.protein.color}`}>
                    {Math.round(meal.protein.value)}
                  </div>
                </td>
                <td class="meal-numerical">
                  <div class="meal-numerical-color" style={`background: ${meal.saturatedFat.color}`}>
                    {Math.round(meal.saturatedFat.value)}
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/each}
    </div>

  </div>
</div>

<a
  class="flex justify-center items-center w-full h-full hover:bg-lime-200/50 hover:no-underline"
  href={data.nextDayLink}
>
  <div class="text-7xl text-slate-600">
    →
  </div>
</a>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  h1 {
    font-size: 2.5rem;
    margin: 2rem 0;
  }

  h2 {
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .meals-list {
    width: 64rem;
  }

  .meals {
    margin-bottom: 5rem;

    tbody {
      tr:hover {
        background: theme('colors.sky.300 / 0.2');
      }
    }

    th, td {
      text-align: center;
    }

    .meal-name {
      text-align: left;
      max-width: 450px;
    }

    .meal-numerical {
      width: 128px;
    }

    .meal-numerical-color {
      padding: 20px 0;
    }

    .meal-image {
      img {
        width: 128px;
      }

      .img-alternative {
        display: none;
        height: 128px;
        object-fit: cover;
        object-position: 50% 35%;
      }

      &:hover {
        .img-main {
          display: none;
        }

        .img-alternative {
          display: block;
        }
      }
    }
  }
</style>
